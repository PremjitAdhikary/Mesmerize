class MAgination extends PhoneApp {

  constructor() {
    super('M-agination', '/sim-phone-v2/img/app-icons/m-agination.png');
    this._stories = [
      MAgination.COLORED_DRESSES, 
      MAgination.COLORED_BOOKS, 
      MAgination.COLORED_MOOD, 
      MAgination.NAMED_ANIMAL, 
      MAgination.GIFTED_ANIMAL, 
      MAgination.ONLY_ANIMAL, 
      MAgination.GAMERS_LAST_UPSET, 
      MAgination.GAME_BET, 
      MAgination.GAME_YOUNG
    ];
    this._storyIndex = Math.floor(Math.random() * this._stories.length);
    this._formIndex = 0;
  }

  build() {
    super.build();
    this._appRoot.style.backgroundColor = 'rgba(244, 230, 247, 1)';
    this._dataHolder = this.buildDataHolder();
    this._formHolder = this.buildFormHolder();
    this._storyHolder = this.buildStoryHolder();
    this._newStoryBtn = this.buildNewStoryButton();
  }
  
  requiredVersion() {
    return 2;
  }

  buildDataHolder() {
    let dataholder = document.createElement('div');
    dataholder.innerHTML = 'New';
    this._appRoot.appendChild(dataholder);
    this.css(dataholder, MAgination.DATA_HOLDER_STYLE);
    return dataholder;
  }

  buildFormHolder() {
    let formHolder = document.createElement('div');
    this.css(formHolder, MAgination.FORM_HOLDER_STYLE);
    this._appRoot.appendChild(formHolder);
    let qHolder = document.createElement('div');
    qHolder.id = 'magination_que';
    this.css(qHolder, MAgination.QUES_HOLDER_STYLE);
    formHolder.appendChild(qHolder);
    return formHolder;
  }

  buildStoryHolder() {
    let storyHolder = document.createElement('div');
    this.css(storyHolder, MAgination.STORY_HOLDER_STYLE);
    this._appRoot.appendChild(storyHolder);
    return storyHolder;
  }

  buildNewStoryButton() {
    let newStoryBtn = document.createElement('div');
    newStoryBtn.innerHTML = 'New';
    this._appRoot.appendChild(newStoryBtn);
    this.css(newStoryBtn, MAgination.NEW_STORY_BTN_STYLE);
    newStoryBtn.addEventListener('click', e => {
      this._storyIndex = Math.floor(Math.random() * this._stories.length);
      this._stories[this._storyIndex].generateFormInfo();
      this._formIndex = 0;
      this.updateApp();
    });
    return newStoryBtn;
  }

  launch() {
    this.updateApp();
    return super.launch();
  }

  getUserInput() {
    this._stories[this._storyIndex]._formInfo[this._formIndex]._answer = this._services.getClipboard();
    if (!this.allFormQuestionsAnswered()) this._formIndex++;
    this.updateApp();
  }

  updateApp() {
    this.updateData();
    this.updateForm();
    this.updateStory();
    if (!this.allFormQuestionsAnswered()) 
      this._services.showKeyboardScreen('', () => this.getUserInput());
  }

  updateData() {
    this._dataHolder.innerHTML = '';
    for (let i=0; i<this._stories[this._storyIndex]._formInfo.length; i++) {
      let item = this._stories[this._storyIndex]._formInfo[i];
      let itemDiv = document.createElement('div');
      let label = document.createElement('span');
      label.append(document.createTextNode(item._label + ' : '));
      itemDiv.appendChild(label);
      let ans = document.createElement('span');
      ans.append(document.createTextNode(item.processAnswer()));
      ans._id = 'ans_'+i;
      itemDiv.appendChild(ans);
      this._dataHolder.appendChild(itemDiv);
    }
  }

  updateForm() {
    let formInfo = this._stories[this._storyIndex]._formInfo;
    this._formHolder.querySelector("#magination_que").innerHTML = this.allFormQuestionsAnswered() ? '' : formInfo[this._formIndex]._question;
    this._formHolder.style.display = (this.allFormQuestionsAnswered() ? 'none' : 'block');
  }

  updateStory() {
    let story = this._stories[this._storyIndex];
    this._storyHolder.innerHTML = story.generateStory();
    this._storyHolder.style.display = (this.allFormQuestionsAnswered() ? 'block' : 'none');
  }

  allFormQuestionsAnswered() {
    return this._formIndex >= this._stories[this._storyIndex]._formInfo.length;
  }

}

class FormItem {
  constructor(id, label, question, trim = 20) {
    this._id = id;
    this._label = label;
    this._question = question;
    this._trim = trim;
    this._answer = '';
  }
  cloneItem() {
    return new FormItem(this._id, this._label, this._question, this._trim);
  }
  processAnswer() {
    let curr = this._answer.length > this._trim ? this._answer.substring(0, this._trim) : this._answer;
    return curr.replace(/\n/g, " ");
  }
}

class StoryItem {
  constructor(form, storyLine) {
    this._ogForm = form;
    this.generateFormInfo();
    this._storyLine = storyLine;
  }
  generateFormInfo() {
    this._formInfo = [];
    this._ogForm.forEach(item => this._formInfo.push(item.cloneItem()));
  }
  generateStory() {
    return this._formInfo.reduce((s, a) => s.replaceAll(a._id, a.processAnswer()) , this._storyLine);
  }
}

MAgination.DATA_HOLDER_STYLE = {
  color: 'rgba(176, 83, 197, 1)',
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  fontSize: '0.7em',
  fontStyle: 'italic',
  height: '20%',
  padding: '2px'
};

MAgination.FORM_HOLDER_STYLE = {
  color: 'rgba(176, 83, 197, 1)',
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  fontSize: '1.0em',
  fontStyle: 'italic',
  fontWeight: 'bold',
  fontVariant: 'small-caps',
  height: '25%',
  padding: '2px'
};

MAgination.QUES_HOLDER_STYLE = {
  position: 'absolute',
  top: '42%'
};

MAgination.STORY_HOLDER_STYLE = {
  color: 'rgba(176, 83, 197, 1)',
  backgroundColor: 'rgba(213, 191, 218, 1)', 
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  fontSize: '0.8em',
  fontStyle: 'italic',
  fontVariant: 'small-caps',
  height: '70%',
  border: '2px solid rgba(176, 83, 197, 1)', 
  borderRadius: '5px', 
  padding: '5px', 
  margin: '5px'
};

MAgination.NEW_STORY_BTN_STYLE = {
  color: 'rgba(213, 191, 218, 1)', 
  backgroundColor: 'rgba(176, 83, 197, 1)', 
  position: 'absolute', 
  border: '1px solid rgba(176, 83, 197, 1)', 
  borderRadius: '2px', 
  fontSize: '1.1em',
  left: '82%', 
  top: '80%', 
  padding: '2px'
}

MAgination.CHARACTER_COLOR = [
  new FormItem('c1', 'Character 1', 'Name a character'), 
  new FormItem('c2', 'Character 2', 'Name another character'), 
  new FormItem('c3', 'Colour', 'Name your favorite colour')
];

MAgination.NAME_PLACE_ANIMAL_THING = [
  new FormItem('n1', 'Name', 'Give me a name'), 
  new FormItem('p2', 'Place', 'A place you want to go'), 
  new FormItem('a3', 'Animal', 'Your favorite animal'), 
  new FormItem('t4', 'Thing', 'Something you treasure')
];

MAgination.CHARACTER_GAME = [
  new FormItem('c1', 'Character 1', 'Name a character'), 
  new FormItem('c2', 'Character 2', 'Name another character'), 
  new FormItem('g3', 'Game', 'Name your favorite sport or game')
];

MAgination.COLORED_DRESSES = new StoryItem(
  MAgination.CHARACTER_COLOR, 
  'The party theme was c3. c1 wore an elegant c3 costume. c2 had put on every colour in the world except c3. What a contrast it was!'
);

MAgination.COLORED_BOOKS = new StoryItem(
  MAgination.CHARACTER_COLOR, 
  `Libraries are where people usually discover and pick new books according to their favourite genres. Usually being the keyword! Here 
  we have c1 and c2, both have c3 jackets on, both have picked up c3 coloured books to match their jackets.`
);

MAgination.COLORED_MOOD = new StoryItem(
  MAgination.CHARACTER_COLOR, 
  `Mood rings are fascinating piece of jewelry. They change colour based on the mood of the wearer. No wonder c1 is fascinated by the ring 
  on c2's finger. Now only if c1 could recollect the mood that c3 represented!`
);

MAgination.NAMED_ANIMAL = new StoryItem(
  MAgination.NAME_PLACE_ANIMAL_THING, 
  `n1 the a3 is playing with t4 in the dense forests of p2. What? Why does a a3 has a name? The fact that the a3 owns t4 to play with does not 
  concern you but ooooo how can a a3 have a name? That too n1?`
);

MAgination.GIFTED_ANIMAL = new StoryItem(
  MAgination.NAME_PLACE_ANIMAL_THING, 
  `n1 the a3 is playing with t4 in the dense forests of p2. What? Who gave t4 to a a3? Maybe the rangers did not take the t4 with them when they 
  left p2. Maybe it's a heirloom passed on by n1's father. Who cares?`
);

MAgination.ONLY_ANIMAL = new StoryItem(
  MAgination.NAME_PLACE_ANIMAL_THING, 
  `n1 the a3 is playing with t4 in the dense forests of p2. What? How many a3s are there in p2 forest? Good question, just one! That is why we 
  have named a a3 as n1!`
);

MAgination.GAMERS_LAST_UPSET = new StoryItem(
  MAgination.CHARACTER_GAME, 
  `For as long as c1 remembers, whenever they play g3, c2 has always won. But today it looks like things are going to change at last. c1 is 
  ecstatic, last few minutes ... as long as no mistakes are made! But mistakes are made ... c2 wins again!`
);

MAgination.GAME_BET = new StoryItem(
  MAgination.CHARACTER_GAME, 
  `c1 and c2 are watching g3 live on television. Both of them are tensed, after all they have placed a big wager. The transmission stops suddenly. 
  c1 calls the bookie, gets a voicemail, NO REFUNDS if g3 is cancelled. c2 checks online ... earthquake!`
);

MAgination.GAME_YOUNG = new StoryItem(
  MAgination.CHARACTER_GAME, 
  `c1 and c2 loved to play g3. They had played g3 from a very young age. Then they went to different high school, different college, got jobs 
  in different cities. No more g3. Today they meet after years. c1 greets with a sparkle, "Hey c2, wanna play?"`
);