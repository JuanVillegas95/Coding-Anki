Convetnions i did
C stants fort constants
F for functions
S for styles

Having different components in different files is troblsome so i made a file to keep them separated
There is only one file for page meaning all the components in one file



NOTES FOR MY FORMAT EVERY STYLKED COMPPOENT AHS WHAT IT IS AT THE END OF THE NAME 
```
const TimeInput: React.FC<{
  handleTime: (e: React.ChangeEvent<HTMLSelectElement>, tag: string) => void
  text: string,
  time: Time,

}> = ({ text, time, handleTime }) => {

  const hours: string[] = F.generate24Hours();
```

tHESE HOW IT LOOKS A REACT COMPONENT FIRSTR FUNCTION THEN THE DESTORUCTOURED MEMEBRTS