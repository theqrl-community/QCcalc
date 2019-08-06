HOW TO RUN:
> You will need either Matlab or Octave
> Add the folder containing 'QCcalc.m' to your directory
> Type 'QCcalc' into the command window (no quotation marks)

This script was created and validated to work in Matlab R2016a, and does not use any extra packages beyond the base program. It was not tested on Octave.

WHAT THIS PROGRAM DOES:
Generates a probability distribution for the likelihood that 256-bit ECDSA signatures will be 'broken' by quantum computer over the course of the coming years. It relies entirely on your input parameters. The goal is to clearly visualize the logical implications of a given set of assumptions about the progress of quantum computing.

OUTPUTS:
> (optional) two graphs: a cumulative probability distribution and underlying probability distribution function
> (optional) a .mat file with the results of your simulation
> the year at which ECDSA is 50% likely to be broken by according to your input assumptions -- this is the x-intercept of when the cumulative probability crosses 0.5
> the individual year in which ECDSA is most likely to be broken according to your input assumptions -- this is the mode of the of the probability distribution of outcomes

SPEED-RELATED SETTINGS:
These settings do not affect the model, but do affect the noisiness of the results as well as how fast the program will run.
[opt.nSamples] - This is the number of random samples that the simulation will run. The higher this number is, the less noisy the results will be, but also the slower it will be to run. Default is 10,000. For quick runs, 1,000 or 2,000 should be fine. For very clean-looking results, 30,000+ is ideal.
[opt.nYears] - the number of years to calculate into the future (also affects run speed)

SUMMARY OF THE METHODOLOGY USED:
This model operationalizes a 'lattice surgery' approach to factoring 2048-bit RSA by Gidney & Ekera (2019), and generalizes it to ECDSA. For an explanation of the relevant variables and equations related to quantum computing, see this thread:
https://twitter.com/JSmith_Crypto/status/1157312090144747520

PARAMETERS:
[par.yearly_increaseInQubits] - The yearly percentage increase in the number of *physical* qubits that superconducting quantum computers will have available to them to use for calculations. For example, setting this value to '100' would imply a yearly doubling in the # of qubits available.

[par.yearly_errorRateImprovement] - The yearly percentage decrease in the physical gate error of the state-of-the-art superconducting qubits.

[par.yearly_algorithmicImprovement] - The yearly percentage decrease in the number of logical qubits required to crack 256-bit ECDSA signatures due to algorithmic improvements (the number has fallen by over an order magnitude in the last several years, as of the time of writing, but the default value for the script is conservative).

[par.parameter_uncertainty] - Uncertainty is applied as the standard deviation for each of those variables when simulating their range of possible values (randomly sampled from a Gaussian probability distribution).

[par.maximum_acceptableRisk] - ECDSA is deemed “broken” when the probability of at least one public key being reversed into its respective private key in a given year exceeds this value (in percent).

[par.req_runTime] - The amount of time available to the QC to run in order to crack a given public key. The default is set conservatively to one week, although in the case of cryptocurrency, due to the high value of the first couple of addresses to be cracked, this time could arguably be set more accurately to several months.

[par.public_nPhysQubits] - The size of the largest quantum computer in the current year that you are running the script (provides the start point from which the 'nQubits' variable is scaled).

[par.public_physErrRate] - The error rate of qubits in the above computer (Gidney & Ekera 2019 assumed 0.1%, which seems on par with the state of the art in mid 2019)

[par.thisYear] - the current year

[par.ECDSA_keySize] - will work for values of 256, 384, and 521

OPTIONS:
[opt.wannaSaveResults] - will save the cumulative probability results to a .mat file in your current directory

[opt.wannaPlot] - set to 1 to generate the cumulative probability and probability distribution plots

[opt.wannaSavePlots] - will save the plots to your current directory. NOTE: to help with referencing the results of previous runs, the numbers at the end of the save file are:

par.yearly_increaseInQubits 'x' par.yearly_errorRateImprovement 'x' par.yearly_algorithmicImprovement 'x' par.parameter_uncertainty '_' par.req_runTime 'hrs' '_' opt.nYears 'yrs'

[opt.plotGridlines] - adds gridlines to the cumulative probability plot

[opt.figSize] - sets the size of your plot figures [horizontal vertical]

[opt.inclFigTitles] - makes plots without titles if set to 0

[opt.inclXlabel] - toogle x axis labels

[opt.inclXticks] - toggle x axis tick labels

[opt.inclYlabel] - toggle y axis labels
