# QCCalc Web Branch (gh-pages)

## Precompiling outputs

QCcalc.m can be called from the command line:

```bash
flatpak run org.octave.Octave -Wq QCcalc.m $y_increaseInQubits_value $y_algorithmicImprovement_value $y_errorRateImprovement_value $uncertainty_value $runTime_value
```

```bash
flatpak run org.octave.Octave -Wq QCcalc.m 25 25 25 25 24
```

This will output a file to assets/raw/c
