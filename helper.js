

let removeLineBreaks (response) =>  {
  let arrayResponse = response.split('\n');
  return arrayResponse[1].trim()
}
