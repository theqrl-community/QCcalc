clear; close all;

%% INPUT PARAMETERS
% set these values for yourself
par.yearly_increaseInQubits = 10; % in percent (0-100) -- note: 100% improvement is doubling the # qubits every year.
par.yearly_errorRateImprovement = 10; % in percent (0-100) -- note: 50% improvement is cutting the error rate in half every year.
par.yearly_algorithmicImprovement = 10; % in percent(0-100) -- this directly impacts the number of logical qubits required.
par.parameter_uncertainty = 10; % percent uncertainty about the above parameters
% NOTE: uncertainty here (and below) is equivalent to one standard deviation of a Gaussian distribution 
% centered on the given parameter's specified value
par.maximum_acceptableRisk = 1; % the maximum acceptable percent chance that ECDSA is cracked in a given year;
% once that chance exceeds this value, ECDSA is defined as "broken"
par.req_runTime = 24*7*1; % hours (default: 1 week)
par.public_nPhysQubits = 72; % from Google's Bristlecone chip.
% Rigetti's 128 qubit machine is a slightly less conservative alternative
par.public_physErrRate = 0.001; % 0.1 percent

% Other parameters:
par.thisYear = 2019;
par.ECDSA_keySize = 256; % Bitcoin is 256-bit, for reference, as are most 'altcoins'
% this model will work on any of the following key sizes tho    ugh: [256 384 521];

% Options:
opt.nSamples = 5000; % higher count --> longer runtime, less-noisy estimates
opt.nYears = 100; % should be large enough to contain the majority of the resulting probability distribution distribution
% if 100 is too 'zoomed-out' 50 is a good option

opt.wannaSaveResults = 0;
opt.wannaPlot = 1; % if 0, will not generate plots
opt.wannaSavePlots = 0; % if 0, wil not save the plots
opt.plotGridlines = 1; % adds gridlines to the cumulative probability plot
opt.figSize = [5 3]; % default: [5 3];
opt.inclFigTitles = 1;
opt.inclXlabel = 1;
opt.inclXticks = 1;
opt.inclYlabel = 1;

%% MAIN CODE -- QC calc

% calculate the logical error rate implied by the selected required runtime
logical_errorRate_8h = 10^-15; % the one used by Gidney 2017 to factor RSA-2048 in 8 hours using 20mil noisy qubits
timeEquiv = par.req_runTime/8; % estimating the equivalent target logical error rate for different runtime constraints
implied_logicalErrRate = logical_errorRate_8h * timeEquiv;

% convert input parameters to appropriate format
growthFactor_nQubits = 1 + par.yearly_increaseInQubits/100;
declineFactor_errRate = 1 - par.yearly_errorRateImprovement/100;
algorithmicImprovement = 1 - par.yearly_algorithmicImprovement/100;
c_sep = 1024; % AKA "runway spacing" -- see table III from Gidney 2019
switch par.ECDSA_keySize
    case 256, modulus_size_equiv = (2330/4098)*2048;
    case 384, modulus_size_equiv = (3484/4098)*2048;
    case 521, modulus_size_equiv = (4719/4098)*2048;
end
% these are the #qubits-reguired numbers from Roetteler 2017, table 2;
% 2330 is the # of qubits req'd for DLP @ n=256, and 4098 is the # req'd for RSA-2048.
% The ratio of those numbers is used here to scale the number of qubits required to the problem at hand.
% NOTE: this can be changed to take into account different key size as long as those key sizes
% were contained in Roetteler 2017.

sample_qubitGrowth = []; sample_errRateDecline = []; sample_logErrRate = []; sample_algoImprovement = [];
% Now, sample n values of the nQubit growth, error rate deline, and target logical error rate from a normal distribution
% centered on each parameter's user-specified value, with sigma = user-specified 'uncertainty'
% Note: technology doesn't progress backwards, so we throw out all the potential samples where that happens
while length(sample_qubitGrowth) < opt.nSamples
    potential_qG = normrnd(growthFactor_nQubits,growthFactor_nQubits*par.parameter_uncertainty/100,1,opt.nSamples);
    potential_qG(find(potential_qG < 1)) = NaN;
    sample_qubitGrowth = [sample_qubitGrowth potential_qG];
    sample_qubitGrowth = sample_qubitGrowth(~isnan(sample_qubitGrowth));
end

while length(sample_errRateDecline) < opt.nSamples
    potential_eRD = normrnd(declineFactor_errRate,(1 - declineFactor_errRate)*par.parameter_uncertainty/100,1,opt.nSamples);
    potential_eRD(find(potential_eRD < 0)) = NaN; 
    potential_eRD(find(potential_eRD > 1)) = NaN;
    sample_errRateDecline = [sample_errRateDecline potential_eRD];
    sample_errRateDecline = sample_errRateDecline(~isnan(sample_errRateDecline));
end

while length(sample_logErrRate) < opt.nSamples
    potential_lER = normrnd(implied_logicalErrRate,implied_logicalErrRate*par.parameter_uncertainty/100,1,opt.nSamples);
    potential_lER(find(potential_lER < 0)) = NaN;
    sample_logErrRate = [sample_logErrRate potential_lER];
    sample_logErrRate = sample_logErrRate(~isnan(sample_logErrRate));
end

while length(sample_algoImprovement) < opt.nSamples
    potential_aI = normrnd(algorithmicImprovement,(1-algorithmicImprovement)*par.parameter_uncertainty/100,1,opt.nSamples);
    potential_aI(find(potential_aI < 0)) = NaN; 
    potential_aI(find(potential_aI > 1)) = NaN;
    sample_algoImprovement = [sample_algoImprovement potential_aI];
    sample_algoImprovement = sample_algoImprovement(~isnan(sample_algoImprovement));
end

sample_qubitGrowth = sample_qubitGrowth(1:opt.nSamples);
sample_errRateDecline = sample_errRateDecline(1:opt.nSamples);
sample_logErrRate = sample_logErrRate(1:opt.nSamples);
sample_algoImprovement = sample_algoImprovement(1:opt.nSamples);

chanceBroken = NaN(opt.nSamples,opt.nYears); % just to initialize this variable;
yearsOut = [1:opt.nYears];

for sample = 1:opt.nSamples
    % sample the relevant parameters from their prior distributions, but
    % cut off values that don't make sense (such as negative qubit growth,
    % error rate increasing instead of declining, etc...)
    qubitGrowth = sample_qubitGrowth(sample);
    errRateDecline = sample_errRateDecline(sample);
    logical_errRate = sample_logErrRate(sample);
    algoImprovement = sample_algoImprovement(sample);
    
    extrap_physErr = par.public_physErrRate * errRateDecline.^yearsOut; % get the extrapolated physical error rate for each year
    for year = 1:opt.nYears
        % this code distance calculation is a rearrangement of the equation at the end of section XV in Fowler & Gidney (2018).
        codeDistance(year) =  (-log(extrap_physErr(year)) + 2*log(logical_errRate))/(2*log(10) + log(extrap_physErr(year)));
        PhysQubits_perLogQubit(year) = 2*(codeDistance(year) + 1)^2; % from Gidney & Ekera (2019)
        % ratio taken from Roetteler 2017 table 2, '#Qubits' estimates]
        req_nLogQubits = (113 * (modulus_size_equiv / c_sep) * 63)*algoImprovement^year; % algo improvement is scaled in heuristically
        req_nPhysQubits(year) = req_nLogQubits * PhysQubits_perLogQubit(year);
        extrap_nPhysQubits(year) = round(par.public_nPhysQubits * qubitGrowth^year);
        extrap_nPhysQubits_SD(year) = sqrt(extrap_nPhysQubits(year)); % ???
        try
            chanceBroken(sample,year) = 1 - normcdf(req_nPhysQubits(year),extrap_nPhysQubits(year),extrap_nPhysQubits_SD(year));
        catch
            chanceBroken(sample,year) = NaN; % in case some NaN or Inf arises from extreme parameter values above
        end
    end
    clearvars qubitGrowth errRateGrowth extrap_physErr codeDistance PhysQubits_perLogQubit ...
        logical_errRate req_nPhysQubits extrap_nPhysQubits extrap_nPhysQubits_SD
    
    if mod(sample,100) == 0, clc; disp([num2str(round((sample/opt.nSamples)*100)) '% done sampling']); end
    
end

riskUnacceptable = chanceBroken > (par.maximum_acceptableRisk / 100);

for s = 1:opt.nSamples
    % find the first year where the risk is > the maximum acceptable level
    if isempty(find(riskUnacceptable(s,:),1,'first')), howLong_tilBroken(s,1) = NaN;
    else howLong_tilBroken(s,1) = find(riskUnacceptable(s,:),1,'first'); end
end

cumulativeProb = nansum(chanceBroken,1)/opt.nSamples;
disp(['50% chance of being broken in ' num2str(find(cumulativeProb>0.5,1,'first')) ' years']);
disp(['most likely year to be broken in: ' num2str(mode(howLong_tilBroken))]);
paramStr = [num2str(round(par.yearly_increaseInQubits)) 'x' num2str(round(par.yearly_errorRateImprovement)) ...
    'x' num2str(round(par.yearly_algorithmicImprovement)) 'x' num2str(round(par.parameter_uncertainty)) '_' ...
    num2str(round(par.req_runTime)) 'hrs_' num2str(round(opt.nYears)) 'yrs'];

%% Plots and saving
if opt.wannaPlot
    close all;
%     histogram(howLong_tilBroken,'BinEdges',[2:2:opt.nYears]) 
%       removed histogram() function here in favor of the older hist() in order to
%       maximize compatibility with Octave
    hist(howLong_tilBroken,[2:2:opt.nYears]) % 2 years to a bin
    h = findobj(gca,'Type','patch');
    set(h,'FaceColor',[218 0 0]/255)
    xlim([0 opt.nYears]);
    if opt.inclFigTitles, title('How long it will take for QCs to break ECDSA','FontSize',10); end
    if opt.inclYlabel, ylabel('relative likelihood','FontSize',10); end
    set(gca,'YTickLabel',[]);
    if opt.inclXticks, set(gca,'XTick',[0:opt.nYears/10:opt.nYears]); else set(gca,'XTick',[]); end
    if opt.inclXlabel, xlabel('# years','FontSize',10); end
    set(gcf, 'PaperPosition', [0 0 opt.figSize])    % can be bigger than screen
    set(gcf, 'PaperSize', [opt.figSize])    % Same, but for PDF output
    if opt.wannaSavePlots, print(gcf, ['simResults_' paramStr], '-dpng', '-r300' ); end
end

if opt.wannaPlot
    figure;
    plot(cumulativeProb,'LineWidth',3,'Color',[218 0 0]/255);
    xlim([0 opt.nYears]); ylim([0 1]);
    if opt.inclFigTitles, title('Cumulative probability of ECDSA being broken by QC','FontSize',10); end
    if opt.inclYlabel, ylabel('chance broken','FontSize',10); end
    if opt.inclXticks, set(gca,'XTick',[0:opt.nYears/10:opt.nYears]); else set(gca,'XTick',[]); end
    if opt.inclXlabel, xlabel('# years','FontSize',10); end
    set(gcf, 'PaperPosition', [0 0 opt.figSize])    % can be bigger than screen
    set(gcf, 'PaperSize', opt.figSize)    % Same, but for PDF output
    if opt.plotGridlines, grid on; end 
    hold on;
    if opt.wannaSavePlots, print(gcf, ['cumulativeDist_' paramStr], '-dpng', '-r300' ); end
end

results.cumulativeProb = cumulativeProb;
results.year_50percentRisk = find(cumulativeProb>0.5,1,'first');
results.mostLikelyYearBroken = mode(howLong_tilBroken);
results.howLong_tilBroken = howLong_tilBroken;

% you can save a file containing the results, parameters, and options that
% you used by setting 'wannaSave' to 1 in the input parameters.
filename = ['QC_threatCalc_' paramStr];
if opt.wannaSaveResults
    save(filename,'results','par','opt');
end
