// Based off of QCCalc.m
// 
// Functions will need to be created.
// This is going to get messy 'temporarily'
'use strict';


// Octave/matlab & support functions
// !! important to note that there's no unit testing.
function prod() {

}
function size() {

}
function zeros() {

}
function randn() {

}

//RNDCHECK error checks the argument list for the random number generators.
// https://www.mathworks.com/matlabcentral/mlc-downloads/downloads/submissions/3948/versions/2/previews/rndcheck.m/index.html

//   B.A. Jones  1-22-93
//   Copyright (c) 1993-98 by The MathWorks, Inc.
//   $Revision: 2.5 $  $Date: 1997/11/29 01:46:40 $
function rndcheck(nargs,nparms,arg1,arg2,arg3,arg4,arg5) {

var sizeinfo = nargs - nparms;
var errorcode = 0;

if (nparms == 3) {
	[r1, c1] = size(arg1);
    [r2, c2] = size(arg2);
    [r3, c3] = size(arg3);
}

if (nparms == 2) {
    [r1 c1] = size(arg1);
    [r2 c2] = size(arg2);
}
 

if (sizeinfo == 0) {     
    if (nparms == 1) {
        [rows columns] = size(arg1);
    }
    
    if (nparms == 2) {
        scalararg1 = (prod(size(arg1)) == 1);
        scalararg2 = (prod(size(arg2)) == 1);
        if (~scalararg1 & ~scalararg2) {
            if r1 ~= r2 | c1 ~= c2
                errorcode = 1;
                return;         
            }
        }
        if (~scalararg1) {
            [rows columns] = size(arg1);
        } else if (~scalararg2) {
            [rows columns] = size(arg2);
        } else {
            [rows columns] = size(arg1);
        }
    }
    
    if (nparms == 3) {
        scalararg1 = (prod(size(arg1)) == 1);
        scalararg2 = (prod(size(arg2)) == 1);
        scalararg3 = (prod(size(arg3)) == 1);

        if (~scalararg1 & ~scalararg2) {
            if (r1 ~= r2 | c1 ~= c2) {
                errorcode = 1;
                return;         
            }
        }

        if (~scalararg1 & ~scalararg3) {
            if (r1 ~= r3 | c1 ~= c3) {
                errorcode = 1;
                return;                 
            }
        }

        if (~scalararg3 & ~scalararg2) {
            if (r3 ~= r2 | c3 ~= c2) {
                errorcode = 1;
                return;         
            }
        
            if (~scalararg1) {
                [rows columns] = size(arg1);
            } else if(~scalararg2) {
            	[rows columns] = size(arg2);
            } else {
                [rows columns] = size(arg3);
            }

        }
    }
}

if (sizeinfo == 1) {
    scalararg1 = (prod(size(arg1)) == 1);
    if (nparms == 1) {
        if (prod(size(arg2)) ~= 2) {
            errorcode = 2;
            return;
        }
        if  (~scalararg1 & arg2 ~= size(arg1)) {
            errorcode = 3;
            return;
        }
        if ((arg2(1) < 0 | arg2(2) < 0 | arg2(1) ~= round(arg2(1)) | arg2(2) ~= round(arg2(2))) ) {
            errorcode = 4;
            return;
        }
        rows    = arg2(1);
        columns = arg2(2);
    }
    
    if (nparms == 2) {
        if (prod(size(arg3)) ~= 2) {
            errorcode = 2;
            return;
        }
        scalararg2 = (prod(size(arg2)) == 1);
        if (~scalararg1 & ~scalararg2) {
            if (r1 ~= r2 | c1 ~= c2) {
                errorcode = 1;
                return;         
            }
        }
        if ((arg3(1) < 0 | arg3(2) < 0 | arg3(1) ~= round(arg3(1)) | arg3(2) ~= round(arg3(2)))) {
            errorcode = 4;
            return;
        } 
        if (~scalararg1) {
            if (any(arg3 ~= size(arg1))) {
                errorcode = 3;
                return;
            }
            [rows, columns] = size(arg1);
        } else if (~scalararg2) {
            if any(arg3 ~= size(arg2)) {
                errorcode = 3;
                return;
            }
            [rows columns] = size(arg2);
        } else {
            rows    = arg3(1);
            columns = arg3(2);
        }
    }
    
    if (nparms == 3) {
        if ((prod(size(arg4)) ~= 2)) {
            errorcode = 2;
            return;
        }
        scalararg1 = (prod(size(arg1)) == 1);
        scalararg2 = (prod(size(arg2)) == 1);
        scalararg3 = (prod(size(arg3)) == 1);

        if (((arg4(1) < 0 | arg4(2) < 0 | arg4(1) ~= round(arg4(1)) | arg4(2) ~= round(arg4(2))))) {
            errorcode = 4;
            return;
        }

        if (~scalararg1 & ~scalararg2) {
            if (r1 ~= r2 | c1 ~= c2) {
                errorcode = 1;
                return;         
            }
        }

        if (~scalararg1 & ~scalararg3) {
            if (r1 ~= r3 | c1 ~= c3) {
                errorcode = 1;
                return;                 
            }
        }

        if (~scalararg3 & ~scalararg2) {
            if (r3 ~= r2 | c3 ~= c2) {
                errorcode = 1;
                return;         
            }
        }
        if (~scalararg1) {
            if (any(arg4 ~= size(arg1))) {
                errorcode = 3;
                return;
            }
            [rows, columns] = size(arg1);
        } else if (~scalararg2) {
            if (any(arg4 ~= size(arg2))) {
                errorcode = 3;
                return;
            }
            [rows columns] = size(arg2);
        } else if (~scalararg3) {
            if (any(arg4 ~= size(arg3))) {
                errorcode = 3;
                return;
            }
            [rows columns] = size(arg3);
        } else {
            rows    = arg4(1);
            columns = arg4(2);
        }
    }
}

if (sizeinfo == 2) {
    if (nparms == 1) {
        scalararg1 = (prod(size(arg1)) == 1);
        if (~scalararg1) {
            [rows columns] = size(arg1);
            if (rows ~= arg2 | columns ~= arg3) {
                errorcode = 3;
                return;
            }
        }
    if ((arg2 < 0 | arg3 < 0 | arg2 ~= round(arg2) | arg3 ~= round(arg3))) {
        errorcode = 4;
        return;
    }
        rows = arg2;
        columns = arg3;
    }
    
    if (nparms == 2) {
        scalararg1 = (prod(size(arg1)) == 1);
        scalararg2 = (prod(size(arg2)) == 1);
        if (~scalararg1 & ~scalararg2) {
            if (r1 ~= r2 | c1 ~= c2) {
                errorcode = 1;
                return;         
            }
        }
        if (~scalararg1) {
            [rows columns] = size(arg1);
            if (rows ~= arg3 | columns ~= arg4) {
                errorcode = 3;
                return;
            }     
        } else if (~scalararg2)
            [rows columns] = size(arg2);
            if (rows ~= arg3 | columns ~= arg4) {
                errorcode = 3;
                return;
            }     
        } else {
            if (arg3 < 0 | arg4 < 0 | arg3 ~= round(arg3) | arg4 ~= round(arg4)) {
                errorcode = 4;
                return;
            }
            rows = arg3;
            columns = arg4;
        }
    }
    
    if (nparms == 3) {
        scalararg1 = (prod(size(arg1)) == 1);
        scalararg2 = (prod(size(arg2)) == 1);
        scalararg3 = (prod(size(arg3)) == 1);

        if (~scalararg1 & ~scalararg2) {
            if (r1 ~= r2 | c1 ~= c2) {
                errorcode = 1;
                return;         
            }
        }

        if (~scalararg1 & ~scalararg3) {
            if (r1 ~= r3 | c1 ~= c3) {
                errorcode = 1;
                return;                 
            }
        }

        if (~scalararg3 & ~scalararg2) {
            if (r3 ~= r2 | c3 ~= c2) {
                errorcode = 1;
                return;         
            }
        }
        
        if (~scalararg1) {
            [rows columns] = size(arg1);
            if (rows ~= arg4 | columns ~= arg5) {
                errorcode = 3;
                return;
            }
        } else if (~scalararg2) {
            [rows columns] = size(arg2);
            if (rows ~= arg4 | columns ~= arg5) {
                errorcode = 3;
                return;
            }
        } else if (~scalararg3) {
            [rows columns] = size(arg3);
            if (rows ~= arg4 | columns ~= arg5) {
                errorcode = 3;
                return;
            }
        } else {
            if (arg4 < 0 | arg5 < 0 | arg4 ~= round(arg4) | arg5 ~= round(arg5)) {
                errorcode = 4;
                return;
            }
            rows    = arg4;
            columns = arg5;
        }
    }
}
}
function normrnd(mu, sigma, m, n) {
	// Check parameters
	let nargin = arguments.length;

	if (nargin < 2) {
	    error('Requires at least two input arguments.');
	}

	if (nargin == 2) {
	    [errorcode rows columns] = rndcheck(2,2,mu,sigma);
	}

	if (nargin == 3) {
	    [errorcode rows columns] = rndcheck(3,2,mu,sigma,m);
	}

	if (nargin == 4) {
	    [errorcode rows columns] = rndcheck(4,2,mu,sigma,m,n);
	}

	if (errorcode > 0) {
	    error('Size information is inconsistent.');
	}

	// Initialize r to zero.
	r = zeros(rows, columns);

	r = randn(rows, columns) .* sigma + mu;

	// Return NaN if SIGMA is not positive.
	if any(any(sigma <= 0));
	    if prod(size(sigma) == 1)
	        tmp = NaN;
	        r = tmp(ones(rows,columns));
	    else
	        k = find(sigma <= 0);
	        tmp = NaN;
	        r(k) = tmp(ones(size(k)));
	    end
	end
}

function find() {

}

function isnan() {

}

function disp(text) {
	console.log(text);
}

function mod() {

}

function hist() {

}

let parameter = {
	// in percent (0-100) -- note: 100// improvement is doubling the # qubits every year.
	yearly_increaseInQubits: 10, 

	// in percent (0-100) -- note: 50 = cutting the error rate in half every year.
	yearly_errorRateImprovement: 10, 

	// in percent(0-100) -- note: 50 = cutting the # of LOGICAL qubits required in half every year
	yearly_algorithmicImprovement: 10, 

	// percent uncertainty about the above parameters
	parameter_uncertainty: 10, 
	maximum_acceptableRisk: 1,
	req_runTime: 24*7*1,
	
	// from Google's Bristlecone chip.
	public_nPhysQubits: 72, 
	public_physErrRate: 0.001,

	thisYear: 2019,
	
	// Bitcoin is 256-bit, for reference, as are most 'altcoins'
	ECDSA_keySize: 256
};


let option = {
	// higher count --> longer runtime, less-noisy estimates
	nSamples: 2,

	// should be large enough to contain the majority of the resulting probability distribution distribution
	nYears: 100,
	wannaSaveResults: 0,
	//if 0, will not generate plots
	wannaPlot: 1, 
	// if 0, wil not save the plots
	wannaSavePlots: 0, 
	// adds gridlines to the cumulative probability plot
	plotGridlines: 1,
	// default: [5 3];
	figSize: [5 3],
	inclFigTitles: 1,
	inclXlabel: 1,
	inclXticks: 1,
	inclYlabel: 1,
	// (in years); 2 by default, can change to lower or higher if 2-year bins doesn't do a good job of capturing the shape of your resulting distribution
	histogramBinSize: 1
}

//// MAIN CODE -- QC calc

// calculate the logical error rate implied by the selected required runtime
logical_errorRate_8h = 10^-15; // the one used by Gidney 2017 to factor RSA-2048 in 8 hours using 20mil noisy qubits
timeEquiv = parameter.req_runTime/8; // estimating the equivalent target logical error rate for different runtime constraints
implied_logicalErrRate = logical_errorRate_8h * timeEquiv;

// convert input parameters to appropriate format
growthFactor_nQubits = 1 + parameter.yearly_increaseInQubits/100;
declineFactor_errRate = 1 - parameter.yearly_errorRateImprovement/100;
algorithmicImprovement = 1 - parameter.yearly_algorithmicImprovement/100;
c_sep = 1024; // AKA "runway spacing" -- see table III from Gidney 2019

switch (parameter.ECDSA_keySize) {
    case 256: 
    	modulus_size_equiv = (2330/4098)*2048;
    break;

    case 384: 
    	modulus_size_equiv = (3484/4098)*2048;
    break;

    case 521: 
    	modulus_size_equiv = (4719/4098)*2048;
	break;
}

// these are the #qubits-reguired numbers from Roetteler 2017, table 2;
// 2330 is the # of qubits req'd for DLP @ n=256, and 4098 is the # req'd for RSA-2048.
// The ratio of those numbers is used here to scale the number of qubits required to the problem at hand.
// NOTE: this can be changed to take into account different key size as long as those key sizes
// were contained in Roetteler 2017.
sample_qubitGrowth = []; 
sample_errRateDecline = []; 
sample_logErrRate = []; 
sample_algoImprovement = [];


// Now, sample n values of the nQubit growth, error rate deline, and target logical error rate from a normal distribution
// centered on each parameter's user-specified value, with sigma = user-specified 'uncertainty'
// Note: technology doesn't progress backwards, so we throw out all the potential samples where that happens
while (sample_qubitGrowth.length < option.nSamples) {
    potential_qG = normrnd(growthFactor_nQubits, growthFactor_nQubits*parameter.parameter_uncertainty/100, 1, option.nSamples );
    potential_qG(find(potential_qG < 1)) = NaN;
    sample_qubitGrowth = [sample_qubitGrowth potential_qG];
    sample_qubitGrowth = sample_qubitGrowth(~isnan(sample_qubitGrowth));
}

while (sample_errRateDecline.length < option.nSamples) {
    potential_eRD = normrnd(declineFactor_errRate,(1 - declineFactor_errRate)*parameter.parameter_uncertainty/100,1,option.nSamples);
    potential_eRD(find(potential_eRD < 0)) = NaN; 
    potential_eRD(find(potential_eRD > 1)) = NaN;
    sample_errRateDecline = [sample_errRateDecline potential_eRD];
    sample_errRateDecline = sample_errRateDecline(~isnan(sample_errRateDecline));
}

while (sample_logErrRate.length < option.nSamples) {
    potential_lER = normrnd(implied_logicalErrRate,implied_logicalErrRate*parameter.parameter_uncertainty/100,1,option.nSamples);
    potential_lER(find(potential_lER < 0)) = NaN;
    sample_logErrRate = [sample_logErrRate potential_lER];
    sample_logErrRate = sample_logErrRate(~isnan(sample_logErrRate));
}

while (sample_algoImprovement.length < option.nSamples) {
    potential_aI = normrnd(algorithmicImprovement,(1-algorithmicImprovement)*parameter.parameter_uncertainty/100,1,option.nSamples);
    potential_aI(find(potential_aI < 0)) = NaN; 
    potential_aI(find(potential_aI > 1)) = NaN;
    sample_algoImprovement = [sample_algoImprovement potential_aI];
    sample_algoImprovement = sample_algoImprovement(~isnan(sample_algoImprovement));
}

sample_qubitGrowth = sample_qubitGrowth(1:option.nSamples);
sample_errRateDecline = sample_errRateDecline(1:option.nSamples);
sample_logErrRate = sample_logErrRate(1:option.nSamples);
sample_algoImprovement = sample_algoImprovement(1:option.nSamples);

chanceBroken = NaN(option.nSamples,option.nYears); // just to initialize this variable;
yearsOut = [1:option.nYears];

for sample = 1:option.nSamples
    // sample the relevant parameters from their prior distributions, but
    // cut off values that don't make sense (such as negative qubit growth,
    // error rate increasing instead of declining, etc...)
    qubitGrowth = sample_qubitGrowth(sample);
    errRateDecline = sample_errRateDecline(sample);
    logical_errRate = sample_logErrRate(sample);
    algoImprovement = sample_algoImprovement(sample);
    
    extrap_physErr = parameter.public_physErrRate * errRateDecline.^yearsOut; // get the extrapolated physical error rate for each year
    for year = 1:option.nYears
        // this code distance calculation is a rearrangement of the equation at the end of section XV in Fowler & Gidney (2018).
        codeDistance(year) =  (-log(extrap_physErr(year)) + 2*log(logical_errRate))/(2*log(10) + log(extrap_physErr(year)));
        PhysQubits_perLogQubit(year) = 2*(codeDistance(year) + 1)^2; // from Gidney & Ekera (2019)
        // ratio taken from Roetteler 2017 table 2, '#Qubits' estimates]
        req_nLogQubits = (113 * (modulus_size_equiv / c_sep) * 63)*algoImprovement^year; // algo improvement is scaled in heuristically
        req_nPhysQubits(year) = req_nLogQubits * PhysQubits_perLogQubit(year);
        extrap_nPhysQubits(year) = round(parameter.public_nPhysQubits * qubitGrowth^year);
        extrap_nPhysQubits_SD(year) = sqrt(extrap_nPhysQubits(year)); // ???
        try
            chanceBroken(sample,year) = 1 - normcdf(req_nPhysQubits(year),extrap_nPhysQubits(year),extrap_nPhysQubits_SD(year));
        catch
            chanceBroken(sample,year) = NaN; // in case some NaN or Inf arises from extreme parameter values above
        end
    end
    clearvars qubitGrowth errRateGrowth extrap_physErr codeDistance PhysQubits_perLogQubit ...
        logical_errRate req_nPhysQubits extrap_nPhysQubits extrap_nPhysQubits_SD
    
    if mod(sample,100) == 0, clc; disp([num2str(round((sample/option.nSamples)*100)) '// done sampling']); end
    
end

riskUnacceptable = chanceBroken > (parameter.maximum_acceptableRisk / 100);

for s = 1:option.nSamples
    // find the first year where the risk is > the maximum acceptable level
    if isempty(find(riskUnacceptable(s,:),1,'first')), howLong_tilBroken(s,1) = NaN;
    else howLong_tilBroken(s,1) = find(riskUnacceptable(s,:),1,'first'); end
end

cumulativeProb = nansum(chanceBroken,1)/option.nSamples;
disp(['50// chance of being broken in ' num2str(find(cumulativeProb>0.5,1,'first')) ' years']);
disp(['most likely year to be broken in: ' num2str(mode(howLong_tilBroken))]);
paramStr = [num2str(round(parameter.yearly_increaseInQubits)) 'x' num2str(round(parameter.yearly_errorRateImprovement)) ...
    'x' num2str(round(parameter.yearly_algorithmicImprovement)) 'x' num2str(round(parameter.parameter_uncertainty)) '_' ...
    num2str(round(parameter.req_runTime)) 'hrs_' num2str(round(option.nYears)) 'yrs'];



//// Plots and saving
if option.wannaPlot
    close all;
//     histogram(howLong_tilBroken,'BinEdges',[2:2:option.nYears]) 
//       removed histogram() function here in favor of the older hist() in order to
//       maximize compatibility with Octave
    hist(howLong_tilBroken,[2:option.histogramBinSize:option.nYears]) // can set binSize in opts
    h = findobj(gca,'Type','patch');
    set(h,'FaceColor',[218 0 0]/255)
    xlim([0 option.nYears]);
    binCounts = histc(howLong_tilBroken,2:option.histogramBinSize:option.nYears);
    ylim([0 max(binCounts)*1.10]); // get consistent y limits
    if option.inclFigTitles, title('How long it will take for QCs to break ECDSA','FontSize',10); end
    if option.inclYlabel, ylabel('relative likelihood','FontSize',10); end
    set(gca,'YTickLabel',[]);
    if option.inclXticks, set(gca,'XTick',[0:option.nYears/10:option.nYears]); else set(gca,'XTick',[]); end
    if option.inclXlabel, xlabel('# years','FontSize',10); end
    set(gcf, 'PaperPosition', [0 0 option.figSize])    // can be bigger than screen
    set(gcf, 'PaperSize', [option.figSize])    // Same, but for PDF output
    if option.wannaSavePlots, print(gcf, ['simResults_' paramStr '_bin' num2str(option.histogramBinSize)], '-dpng', '-r300' ); end
end

if option.wannaPlot
    figure;
    plot(cumulativeProb,'LineWidth',3,'Color',[218 0 0]/255);
    xlim([0 option.nYears]); ylim([0 1]);
    if option.inclFigTitles, title('Cumulative probability of ECDSA being broken by QC','FontSize',10); end
    if option.inclYlabel, ylabel('chance broken','FontSize',10); end
    if option.inclXticks, set(gca,'XTick',[0:option.nYears/10:option.nYears]); else set(gca,'XTick',[]); end
    if option.inclXlabel, xlabel('# years','FontSize',10); end
    set(gcf, 'PaperPosition', [0 0 option.figSize])    // can be bigger than screen
    set(gcf, 'PaperSize', option.figSize)    // Same, but for PDF output
    if option.plotGridlines, grid on; end 
    hold on;
    if option.wannaSavePlots, print(gcf, ['cumulativeDist_' paramStr], '-dpng', '-r300' ); end
end

results.cumulativeProb = cumulativeProb;
results.year_50percentRisk = find(cumulativeProb>0.5,1,'first');
results.mostLikelyYearBroken = mode(howLong_tilBroken);
results.howLong_tilBroken = howLong_tilBroken;

// you can save a file containing the results, parameters, and options that
// you used by setting 'wannaSave' to 1 in the input parameters.
filename = ['QC_threatCalc_' paramStr];
if option.wannaSaveResults
    save(filename,'results','par','opt');
end