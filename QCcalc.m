clear; close all;

%% INPUT PARAMETERS
par.yearly_increaseInQubits = 40; % in percent (0-100) -- note: 100% improvement is doubling the # qubits every year.
par.yearly_errorRateImprovement = 20; % in percent (0-100) -- note: 50% improvement is cutting the error rate in half every year.
par.yearly_algorithmicImprovement = 10; % in percent(0-100) -- this directly impacts the number of logical qubits required.
par.parameter_uncertainty = 25; % percent uncertainty about the above parameters
% NOTE: uncertainty here (and below) is equivalent to one standard deviation of a Gaussian distribution 
% centered on the given parameter's specified value
par.maximum_acceptableRisk = 1; % the maximum acceptable percent chance that ECDSA is cracked in a given year;
% once that chance exceeds this value, ECDSA is defined as "broken"
par.req_runTime = 24*30; % hours
par.public_nPhysQubits = 72; % from Google's Bristlecone chip.
% Rigetti's 128 qubit machine is a slightly less conservative alternative
par.public_physErrRate = 0.001; % 0.1 percent

% Other parameters:
par.thisYear = 2019;
par.ECDSA_keySize = 256; % Bitcoin is 256-bit, for reference, as are most 'altcoins'
% this model will work on any of the following key sizes tho    ugh: [256 384 521];

% Options:
opt.wannaPlot = 1; % if 0, will not generate plots
opt.plotGridlines = 1; % adds gridlines to the cumulative probability plot
opt.wannaSavePlots = 1; % if 0, wil not save the plots
opt.wannaSaveResults = 0;
opt.nSamples = 5000; % higher count --> longer runtime, less-noisy estimates
opt.nYears = 100; % should be large enough to contain the majority of the resulting probability distribution distribution
% if 100 is too 'zoomed-out' 50 is a good option

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
% Note: technology doesn't progress backwards, so we throw out all the potential scenarios
% where that happens
while length(sample_qubitGrowth) < opt.nSamples
    potential_qG = normrnd(growthFactor_nQubits,growthFactor_nQubits*par.parameter_uncertainty/100,1,opt.nSamples);
    potential_qG(find(potential_qG < 1)) = NaN;
    sample_qubitGrowth = [sample_qubitGrowth potential_qG];
    sample_qubitGrowth = sample_qubitGrowth(~isnan(sample_qubitGrowth));
end

while length(sample_errRateDecline) < opt.nSamples
    potential_eRD = normrnd(declineFactor_errRate,(1 - declineFactor_errRate)*par.parameter_uncertainty/100,1,opt.nSamples);
    potential_eRD(find(potential_eRD < 0)) = NaN; potential_eRD(find(potential_eRD > 1)) = NaN;
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
    potential_aI(find(potential_aI < 0)) = NaN; potential_aI(find(potential_aI > 1)) = NaN;
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
paramStr = [num2str(par.yearly_increaseInQubits) 'x' num2str(par.yearly_errorRateImprovement) ...
    'x' num2str(par.yearly_algorithmicImprovement) 'x' num2str(par.parameter_uncertainty)];

%% Plots and saving
if opt.wannaPlot
    close all;
    if opt.nYears == 50
        histogram(howLong_tilBroken) % binning fix not necessary for 50-year plots
    else
        histogram(howLong_tilBroken,round((opt.nYears-min(howLong_tilBroken))/2)) % 2 years to a bin
    end
    xlim([0 opt.nYears]);
    title('How long it will take for QCs to break ECDSA','FontSize',12)
    xlabel('# years','FontSize',10)
    ylabel('relative likelihood')
    set(gca,'YTickLabel',[]);
    set(gca,'XTick',[0:opt.nYears/10:opt.nYears])
    set(gcf, 'PaperPosition', [0 0 5 3])    % can be bigger than screen
    set(gcf, 'PaperSize', [5 3])    % Same, but for PDF output
    
    if opt.wannaSavePlots, print(gcf, ['simResults_' paramStr '_' num2str(opt.nYears) 'yrs'], '-dpng', '-r300' ); end
end

if opt.wannaPlot
    figure;
    plot(cumulativeProb,'LineWidth',2);
    xlim([0 opt.nYears]);
    title('Cumulative probability of ECDSA being broken by QC','FontSize',10)
    xlabel('# years','FontSize',10)
    ylabel('chance of being broken','FontSize',10);
    set(gca,'XTick',[0:opt.nYears/10:opt.nYears])
    set(gcf, 'PaperPosition', [0 0 5 3])    % can be bigger than screen
    set(gcf, 'PaperSize', [5 3])    % Same, but for PDF output
    if opt.plotGridlines, grid on; end 
    hold on;
    if opt.wannaSavePlots, print(gcf, ['cumulativeDist_' paramStr '_' num2str(opt.nYears) 'yrs'], '-dpng', '-r300' ); end
end

results.cumulativeProb = cumulativeProb;

% you can save a file containing the results, parameters, and options that
% you used by setting 'wannaSave' to 1 in the input parameters.
c = date; runCt = 1; checkingForFiles = 1;
filename = ['QC_threatCalc' num2str(runCt) '_' c];
while checkingForFiles % this part just automatically increments the filename so you don't overwrite your previous saves
    if ~exist([filename '.mat'],'file'), checkingForFiles = 0; end
    if exist([filename '.mat'],'file')
        runCt = runCt + 1;
        filename = ['QC_threatCalc' num2str(runCt) '_' c];
    end
end
if opt.wannaSaveResults
    save(filename,'results','par','opt');
end




