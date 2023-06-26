/* eslint-disable linebreak-style */
/* eslint-disable max-len */
const dropdown = document.getElementById('font-dropdown');
const resultContainer = document.getElementById('result-container');
const definitionContainer = document.createElement('div');
const buttonsContainer = document.createElement('div');

// event listener that lets chose the font style
dropdown.addEventListener('change', (e) => {
  if (e.target.value == 'Sans Serif') {
    resultContainer.style.fontFamily = 'sans-serif';
  } else if (e.target.value == 'Serif') {
    resultContainer.style.fontFamily = 'serif';
  } else {
    resultContainer.style.fontFamily = 'courier';
  }
});

const body = document.getElementById('body');
const lightSwitch = document.getElementById('switch');
const mainInput = document.getElementById('main-input');

const useDark = window.matchMedia('(prefers-color-scheme: dark)');

if (useDark.matches) {
  document.getElementById('light-switch').checked = true;
  body.classList.add('night-theme');
  dropdown.classList.remove('font-dropdown-light');
  dropdown.classList.add('font-dropdown-dark');
  lightSwitch.classList.add('slider-dark');
  mainInput.classList.add('main-input-dark');
} else {
  body.classList.remove('night-theme');
  dropdown.classList.remove('font-dropdown-dark');
  dropdown.classList.add('font-dropdown-light');
  mainInput.classList.remove('main-input-dark');
}

lightSwitch.addEventListener('change', (e) => {
  if (e.target.checked == true) {
    body.classList.add('night-theme');
    dropdown.classList.remove('font-dropdown-light');
    dropdown.classList.add('font-dropdown-dark');
    lightSwitch.classList.add('slider-dark');
    mainInput.classList.add('main-input-dark');
  } else {
    body.classList.remove('night-theme');
    dropdown.classList.remove('font-dropdown-dark');
    dropdown.classList.add('font-dropdown-light');
    mainInput.classList.remove('main-input-dark');
  }
});

const emptyNotAllowed = document.getElementById('empty-not-allowed');

// key-up function, fetches the data if enter is pressed on main input
mainInput.addEventListener('keyup', function(event) {
  if (event.code === 'Enter') {
    if (event.target.value == '') {
      emptyNotAllowed.classList.add('tag-visible');
    } else {
      emptyNotAllowed.classList.remove('tag-visible');
      fetchData(event.target.value);
    }
  }
});

const searchBtn = document.getElementById('search-icon');

// click event on a search btn icon that lies on the main input field
searchBtn.addEventListener('click', (e) => {
  const whatsInside = document.getElementById('main-input').value;
  if (whatsInside == '') {
    emptyNotAllowed.classList.add('tag-visible');
  } else {
    emptyNotAllowed.classList.remove('tag-visible');
    fetchData(whatsInside);
  }
});

// definition of a function makes a call to the API
/**
 * As the method name suggests, this method takes in a word collected from
 * the main input and calls the dictionary API searching for that word
 * @param {string} word
 */
function fetchData(word) {
  resultContainer.innerHTML = '';
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`).then((response) => {
    return response.json();
  }).then((response) => {
    if (response.title == undefined) {
      receivedData = response;

      resultContainer.innerHTML = '';

      const theWord = document.createElement('div');
      const phonetic = document.createElement('div');
      phonetic.classList.add('phonetic');
      theWord.classList.add('the-word');
      theWord.innerHTML = '';
      phonetic.innerHTML = '';
      theWord.innerHTML = receivedData[0].word;

      if (receivedData[0].phonetic == undefined) {
        for (let ph = 0; ph < receivedData[0].phonetics.length; ph++) {
          if (receivedData[0].phonetics[ph].text != undefined) {
            phonetic.innerHTML = receivedData[0].phonetics[ph].text;
          }
        }
      } else {
        phonetic.innerHTML = receivedData[0].phonetic;
      }

      if (receivedData.length > 1) {
        const moreDefinitionsTextDiv = document.createElement('div');
        const moreDefinitionsContainer = document.createElement('div');
        buttonsContainer.setAttribute('class', 'buttons-container');
        moreDefinitionsContainer.setAttribute('class', 'more-definitions-container');
        moreDefinitionsTextDiv.innerHTML = `Found ${receivedData.length} definitions:`;
        moreDefinitionsTextDiv.setAttribute('class', 'more-definitions-text');
        moreDefinitionsContainer.appendChild(moreDefinitionsTextDiv);
        moreDefinitionsContainer.appendChild(buttonsContainer);

        buttonsContainer.innerHTML = '';
        for (let d = 0; d < receivedData.length; d++) {
          const definitionBtn = document.createElement('button');
          definitionBtn.setAttribute('class', 'definition-btn');
          definitionBtn.setAttribute('id', `button-${d}`);
          definitionBtn.innerHTML = d+1;
          definitionBtn.addEventListener('click', (e) => {
            definitionContainer.innerHTML = '';
            showSelectedDefinition(d);
          });

          buttonsContainer.appendChild(definitionBtn);
        }

        resultContainer.appendChild(moreDefinitionsContainer);
        const theLineDiv = document.createElement('div');
        theLineDiv.classList.add('the-line-div-2');
        resultContainer.appendChild(theLineDiv);

        const selectedBtn = document.getElementById(`button-${0}`);
        selectedBtn.setAttribute('class', 'selected-btn-style');

        const topInfoContainer = document.createElement('div');
        topInfoContainer.setAttribute('class', 'top-info');

        resultContainer.appendChild(topInfoContainer);

        const theWordAndThePhonetic = document.createElement('div');
        theWordAndThePhonetic.setAttribute('id', 'the-word-and-phonetic');

        theWordAndThePhonetic.appendChild(theWord);
        theWordAndThePhonetic.appendChild(phonetic);
        const audio = document.createElement('audio');
        audio.setAttribute('id', 'audio');

        const playIconDiv = document.createElement('img');
        playIconDiv.setAttribute('src', '/code/assets/images/icon-play.svg');
        playIconDiv.setAttribute('id', 'play-btn');
        playIconDiv.setAttribute('class', 'play audio');

        topInfoContainer.appendChild(theWordAndThePhonetic);
        topInfoContainer.appendChild(playIconDiv);
        topInfoContainer.appendChild(audio);
      } else {
        showSelectedDefinition(0);
      }

      for (let j = 0; j < receivedData[0].phonetics.length; j++) {
        if (receivedData[0].phonetics[j].audio != '') {
          document.getElementById('play-btn').classList.add('show-play-btn');
          audio.setAttribute('src', receivedData[0].phonetics[j].audio);
        }
      }

      for (let i = 0; i < receivedData[0].meanings.length; i++) {
        const partOfSpeechDiv = document.createElement('div');
        partOfSpeechDiv.innerHTML = '';
        partOfSpeechDiv.innerHTML = receivedData[0].meanings[i].partOfSpeech;
        partOfSpeechDiv.classList.add('part-of-speech');

        const theLineDiv = document.createElement('div');

        theLineDiv.classList.add('the-line-div');

        const containerOfMeaningDiv = document.createElement('div');
        const partOfSpeechContainerDiv = document.createElement('div');
        partOfSpeechContainerDiv.classList.add('d-flex');
        partOfSpeechContainerDiv.setAttribute('id', 'part-of-speech-container');
        definitionContainer.appendChild(containerOfMeaningDiv);
        containerOfMeaningDiv.appendChild(partOfSpeechContainerDiv);

        const meaningDiv = document.createElement('div');
        meaningDiv.classList.add('meaning-div');
        meaningDiv.innerHTML = 'Meaning';

        partOfSpeechContainerDiv.appendChild(partOfSpeechDiv);
        partOfSpeechContainerDiv.appendChild(theLineDiv);
        definitionContainer.appendChild(meaningDiv);

        const unorderedList = document.createElement('ul');
        definitionContainer.appendChild(unorderedList);


        for (let g = 0; g < receivedData[0].meanings[i].definitions.length; g++) {
          const listItem = document.createElement('li');
          listItem.classList.add('list-item');
          listItem.innerHTML = receivedData[0].meanings[i].definitions[g].definition;
          unorderedList.appendChild(listItem);
        }

        if (receivedData[0].meanings[i].antonyms.length > 0) {
          const antonymsContainerDiv = document.createElement('div');
          antonymsContainerDiv.setAttribute('class', 'antonym-container');
          const antonymsDiv = document.createElement('div');
          const antonymsTextDiv = document.createElement('div');
          antonymsTextDiv.innerHTML = 'Antonyms: ';
          antonymsTextDiv.classList.add('meaning-div');

          let antonymsString = '';
          for (let a = 0; a < receivedData[0].meanings[i].antonyms.length; a++) {
            antonymsString += receivedData[0].meanings[i].antonyms[a];
            if (a < receivedData[0].meanings[i].antonyms.length - 1) {
              antonymsString += ', ';
            } else {
              antonymsString += ';';
            }
          }
          antonymsDiv.innerHTML = antonymsString;
          antonymsDiv.classList.add('antonyms-list');
          definitionContainer.appendChild(antonymsContainerDiv);
          antonymsContainerDiv.classList.add('d-flex');
          antonymsContainerDiv.appendChild(antonymsTextDiv);
          antonymsContainerDiv.appendChild(antonymsDiv);
        }

        if ((receivedData[0].meanings[i].synonyms.length > 0)) {
          const synonymsContainerDiv = document.createElement('div');
          const synonymsDiv = document.createElement('div');
          const synonymsTextDiv = document.createElement('div');
          synonymsTextDiv.innerHTML = 'Synonyms: ';
          synonymsTextDiv.classList.add('meaning-div');

          let synonymsString = '';
          for (let s = 0; s < receivedData[0].meanings[i].synonyms.length; s++) {
            synonymsString += receivedData[0].meanings[i].synonyms[s];
            if (s < receivedData[0].meanings[i].synonyms.length - 1) {
              synonymsString += ', ';
            } else {
              synonymsString += ';';
            }
          }

          synonymsDiv.innerHTML = synonymsString;
          synonymsDiv.classList.add('antonyms-list');
          definitionContainer.appendChild(synonymsContainerDiv);
          synonymsContainerDiv.classList.add('d-flex');
          synonymsContainerDiv.appendChild(synonymsTextDiv);
          synonymsContainerDiv.appendChild(synonymsDiv);
        }

        if (receivedData.length == 1) {
          clearRepeatedNodes();
        }

        resultContainer.appendChild(definitionContainer);
      }

      document.getElementById('play-btn').addEventListener('click', () => {
        audio.play();
      });

      implementSourceInfo();
    } else {
      const resolution = document.createElement('div');
      resolution.setAttribute('class', 'error-message');
      resolution.innerHTML = response.resolution;
      const message = document.createElement('div');
      message.setAttribute('class', 'error-message');
      message.innerHTML = response.message;
      resultContainer.appendChild(message);
      resultContainer.appendChild(resolution);
    }
  });
}


document.getElementById('font-dropdown').addEventListener('change', () => {
  const sel = document.getElementById('font-dropdown');
  const selectedOptionIndex = sel.selectedIndex;
  const selectedOptionText = sel.options[selectedOptionIndex].value;

  if (selectedOptionText.length > 9) {
    sel.style.width = (selectedOptionText.length / 1.7) + 'rem';
  } else {
    sel.style.width = (selectedOptionText.length / 1.5) + 'rem';
  }
});

/**
 * If more than one word definition is returned by the API,
 * this method takes in definition index received by
 * selecting the specific definition, and displays it on the page
 * @param {int} definitionIndex
 */
function showSelectedDefinition(definitionIndex) {
  buttonsContainer.childNodes.forEach((btn) => {
    if (btn.classList.contains('selected-btn-style')) {
      btn.classList.remove('selected-btn-style');
      btn.classList.add('definition-btn');
    }
  });

  const selectedBtn = document.getElementById(`button-${definitionIndex}`);
  if (selectedBtn != undefined) {
    selectedBtn.setAttribute('class', 'selected-btn-style');
  }

  if (receivedData.length == 1) {
    const theWord = document.createElement('div');
    const phonetic = document.createElement('div');
    phonetic.classList.add('phonetic');
    theWord.classList.add('the-word');
    theWord.innerHTML = '';
    phonetic.innerHTML = '';
    theWord.innerHTML = receivedData[0].word;

    if (receivedData[0].phonetic == undefined) {
      for (let ph = 0; ph < receivedData[0].phonetics.length; ph++) {
        if (receivedData[0].phonetics[ph].text != undefined) {
          phonetic.innerHTML = receivedData[0].phonetics[ph].text;
        }
      }
    } else {
      phonetic.innerHTML = receivedData[0].phonetic;
    }

    const topInfoContainer = document.createElement('div');
    topInfoContainer.setAttribute('class', 'top-info');

    resultContainer.appendChild(topInfoContainer);

    const theWordAndThePhonetic = document.createElement('div');
    theWordAndThePhonetic.setAttribute('id', 'the-word-and-phonetic');

    theWordAndThePhonetic.appendChild(theWord);
    theWordAndThePhonetic.appendChild(phonetic);
    const audio = document.createElement('audio');
    audio.setAttribute('id', 'audio');

    const playIconDiv = document.createElement('img');
    playIconDiv.setAttribute('src', '/code/assets/images/icon-play.svg');
    playIconDiv.setAttribute('id', 'play-btn');
    playIconDiv.setAttribute('class', 'play audio');

    topInfoContainer.appendChild(theWordAndThePhonetic);
    topInfoContainer.appendChild(playIconDiv);
    topInfoContainer.appendChild(audio);
  } else if (receivedData.length > 1) {

  }


  for (let i = 0; i < receivedData[definitionIndex].meanings.length; i++) {
    const partOfSpeechDiv = document.createElement('div');
    partOfSpeechDiv.innerHTML = '';
    partOfSpeechDiv.innerHTML = receivedData[definitionIndex].meanings[i].partOfSpeech;
    partOfSpeechDiv.classList.add('part-of-speech');

    const theLineDiv = document.createElement('div');

    theLineDiv.classList.add('the-line-div');

    const containerOfMeaningDiv = document.createElement('div');
    const partOfSpeechContainerDiv = document.createElement('div');
    partOfSpeechContainerDiv.classList.add('d-flex');
    partOfSpeechContainerDiv.setAttribute('id', 'part-of-speech-container');
    definitionContainer.appendChild(containerOfMeaningDiv);
    containerOfMeaningDiv.appendChild(partOfSpeechContainerDiv);

    const meaningDiv = document.createElement('div');
    meaningDiv.classList.add('meaning-div');
    meaningDiv.innerHTML = 'Meaning';

    partOfSpeechContainerDiv.appendChild(partOfSpeechDiv);
    partOfSpeechContainerDiv.appendChild(theLineDiv);
    definitionContainer.appendChild(meaningDiv);

    const unorderedList = document.createElement('ul');
    definitionContainer.appendChild(unorderedList);


    for (let g = 0; g < receivedData[definitionIndex].meanings[i].definitions.length; g++) {
      const listItem = document.createElement('li');
      listItem.classList.add('list-item');
      listItem.innerHTML = receivedData[definitionIndex].meanings[i].definitions[g].definition;
      unorderedList.appendChild(listItem);
    }

    if (receivedData[definitionIndex].meanings[i].antonyms.length > 0) {
      const antonymsContainerDiv = document.createElement('div');
      antonymsContainerDiv.setAttribute('class', 'antonym-container');
      const antonymsDiv = document.createElement('div');
      const antonymsTextDiv = document.createElement('div');
      antonymsTextDiv.innerHTML = 'Antonyms: ';
      antonymsTextDiv.classList.add('meaning-div');

      let antonymsString = '';
      for (let a = 0; a < receivedData[definitionIndex].meanings[i].antonyms.length; a++) {
        antonymsString += receivedData[definitionIndex].meanings[i].antonyms[a];
        if (a < receivedData[definitionIndex].meanings[i].antonyms.length - 1) {
          antonymsString += ', ';
        } else {
          antonymsString += ';';
        }
      }
      antonymsDiv.innerHTML = antonymsString;
      antonymsDiv.classList.add('antonyms-list');
      definitionContainer.appendChild(antonymsContainerDiv);
      antonymsContainerDiv.classList.add('d-flex');
      antonymsContainerDiv.appendChild(antonymsTextDiv);
      antonymsContainerDiv.appendChild(antonymsDiv);
    }

    if ((receivedData[definitionIndex].meanings[i].synonyms.length > 0)) {
      const synonymsContainerDiv = document.createElement('div');
      const synonymsDiv = document.createElement('div');
      const synonymsTextDiv = document.createElement('div');
      synonymsTextDiv.innerHTML = 'Synonyms: ';
      synonymsTextDiv.classList.add('meaning-div');

      let synonymsString = '';
      for (let s = 0; s < receivedData[definitionIndex].meanings[i].synonyms.length; s++) {
        synonymsString += receivedData[definitionIndex].meanings[i].synonyms[s];
        if (s < receivedData[definitionIndex].meanings[i].synonyms.length - 1) {
          synonymsString += ', ';
        } else {
          synonymsString += ';';
        }
      }

      synonymsDiv.innerHTML = synonymsString;
      synonymsDiv.classList.add('antonyms-list');
      definitionContainer.appendChild(synonymsContainerDiv);
      synonymsContainerDiv.classList.add('d-flex');
      synonymsContainerDiv.appendChild(synonymsTextDiv);
      synonymsContainerDiv.appendChild(synonymsDiv);
    }

    if (receivedData.length > 1) {
      clearRepeatedNodes();
    }

    resultContainer.appendChild(definitionContainer);
  }

  document.getElementById('play-btn').addEventListener('click', () => {
    audio.play();
  });


  implementSourceInfo();
}

/**
 * generates footer of the page that contains information
 * about the source of the word
 */
function implementSourceInfo() {
  const hr = document.createElement('hr');
  hr.classList.add('hr');
  hr.setAttribute('id', 'hr');
  const sourceDiv = document.createElement('a');
  sourceDiv.setAttribute('href', receivedData[0].sourceUrls[0]);
  sourceDiv.setAttribute('class', 'source-link');
  sourceDiv.setAttribute('id', 'source-div');
  const sourceTextDiv = document.createElement('div');
  const sourceContainerDiv = document.createElement('div');
  sourceContainerDiv.classList.add('d-flex');
  sourceTextDiv.classList.add('source');
  sourceDiv.classList.add('source-link');
  sourceTextDiv.innerHTML = 'Source ';
  sourceDiv.innerHTML = receivedData[0].sourceUrls[0];
  resultContainer.appendChild(hr);
  sourceContainerDiv.appendChild(sourceTextDiv);
  sourceContainerDiv.appendChild(sourceDiv);
  resultContainer.appendChild(sourceContainerDiv);
}

// the code demanded clearance of a bug where source div appeared where it shouldn't have
/**
 * Helper function created to clear the bug of extra horizontal line
 * and source after each switch betweeen word definition, or after
 * typing one word after another
 */
function clearRepeatedNodes() {
  resultContainer.childNodes.forEach((node) => {
    const content = node.innerHTML;
    if (content.includes('source')) {
      node.innerHTML = '';
    }

    if (node.className == 'hr') {
      node.className = 'd-none';
    }
  });
}
