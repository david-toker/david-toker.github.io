class FlagQuestion {
    constructor(countries) {
        this.correctAnswer = countries[0].name;
        this.countries = countries;
        this.shuffle();
    }

    shuffle() {
        // shuffling ->this.countries
        for (let i = this.countries.length-1; i >= 0; i--) {
            let randIndex = Math.floor(Math.random()*i);
            let tmp;
            tmp = this.countries[randIndex];
            this.countries[randIndex] = this.countries[i];
            this.countries[i] = tmp;
            }

    }
}

class Country {
    constructor(name, url) {
        this.name = name;
        this.url = url;
    }
}




class Game {
    constructor() {
        this.questions=[];
        
    }

    init() {
        return new Promise((resolve)=> {
            this.fetchData().then(data=>{
                // console.log(JSON.parse(data))
                // console.log(data);  
                            
                this.questions = this.buildQuestions(data);
                resolve();
                // console.log(this.questions);
                // console.log(this.questions[0].correctAnswer);
                
            });
        });
    }

    

    fetchData() {
        // here will return promise that holds at all countries
        return new Promise(function(resolve, reject){
            let xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://restcountries.eu/rest/v2/all');
            xhr.send();
            
            xhr.onreadystatechange = function() {
                if(this.readyState == 4 && this.status == 200) {
                    resolve(this.responseText);
                    // console.log(JSON.parse(this.response))
                    // console.log(this.response);
                } 
                else if(this.status == 404) {
                    reject('error');
                }
            };  
        });
    }

    buildQuestions(data) {

        let allCountries = JSON.parse(data);
        let fortyCountries =[];
        let firstCountry = Math.floor(Math.random()*211);
        // console.log(firstCountry);
        for (let i = firstCountry; i < firstCountry+40; i++) {
            fortyCountries.push(allCountries[i]);
        }
        // console.log(fortyCountries);
        // return fortyCountries;


        let countrToQues = fortyCountries.map(country=>({name: country.name, flag: country.flag}));
        // return countrToQues;

        let arrWithQuestions = [];
        for (let i = 0; i < countrToQues.length; i+=4) {
            let arrWithOption =[];
            let c1 = new Country(countrToQues[i].name, countrToQues[i].flag);
            let c2 = new Country(countrToQues[i+1].name, countrToQues[i+1].flag);
            let c3 = new Country(countrToQues[i+2].name, countrToQues[i+2].flag);
            let c4 = new Country(countrToQues[i+3].name, countrToQues[i+3].flag);
            arrWithOption.push(c1,c2,c3,c4);
            let question = new FlagQuestion(arrWithOption);
            // console.log(bbb.correctAnswer);
            arrWithQuestions.push(question);
        }
        return arrWithQuestions; 
    }
}


let idx = 0;
let gameQuestions = [];
let sumOfCorectAns = 0;
let sumOfUncorectAns = 0;

const g = new Game();
//    console.log(g);
   g.init().then(()=>{
       gameQuestions = g.questions;
    //    console.log(g.questions);
    //    console.log(g.questions[0]);
    //    console.log(g.questions[0].correctAnswer);
    //    console.log(g.questions[0].countries[0].url);
    //    console.log(g.questions.length);
    //    console.log(g.questions[0].countries.find(counrtry=>counrtry.name==g.questions[0].correctAnswer));
    //    console.log(g.questions[0].countries.find(counrtry=>counrtry.name==g.questions[0].correctAnswer).url);
    let flagUrl = g.questions[0].countries.find(counrtry=>counrtry.name==g.questions[0].correctAnswer).url;
    $('#flagContainer').attr('src', flagUrl);
    $('#but1').html(g.questions[0].countries[0].name);
    $('#but2').html(g.questions[0].countries[1].name);
    $('#but3').html(g.questions[0].countries[2].name);
    $('#but4').html(g.questions[0].countries[3].name);
   }); 
    

   
   $('#start').click(function(){
    alert('start');
    g.init().then(()=>{
        gameQuestions = g.questions;
        console.log(g.questions);
     //    console.log(g.questions[0]);
     //    console.log(g.questions[0].correctAnswer);
     //    console.log(g.questions[0].countries[0].url);
     //    console.log(g.questions.length);
     //    console.log(g.questions[0].countries.find(counrtry=>counrtry.name==g.questions[0].correctAnswer));
     //    console.log(g.questions[0].countries.find(counrtry=>counrtry.name==g.questions[0].correctAnswer).url);
     let flagUrl = g.questions[0].countries.find(counrtry=>counrtry.name==g.questions[0].correctAnswer).url;
     $('#flagContainer').attr('src', flagUrl);
     $('#but1').html(g.questions[0].countries[0].name);
     $('#but2').html(g.questions[0].countries[1].name);
     $('#but3').html(g.questions[0].countries[2].name);
     $('#but4').html(g.questions[0].countries[3].name);
     $('#numofquestion').html("Question #"+(idx+1));
    }); 


    

   
    $('.btn-group>button').click(function(e) {
        if (idx < 9) {
            console.log($(this).text());
            if ($(this).text() == gameQuestions[idx].correctAnswer) {
                sumOfCorectAns++;
                console.log(sumOfCorectAns);
                
            }
            else  {
                sumOfUncorectAns++;
                
            }
            

            idx++;

            console.log(g.questions[idx].correctAnswer)
            let flagUrl = gameQuestions[idx].countries.find(counrtry=>counrtry.name==gameQuestions[idx].correctAnswer).url;
            $('#flagContainer').attr('src', flagUrl);
            $('#but1').html(gameQuestions[idx].countries[0].name);
            $('#but2').html(gameQuestions[idx].countries[1].name);
            $('#but3').html(gameQuestions[idx].countries[2].name);
            $('#but4').html(gameQuestions[idx].countries[3].name);
            $('#numofquestion').html("Question #"+(idx+1));
            
        }
        
        else {
            if ($(this).text() == gameQuestions[idx].correctAnswer) {
                sumOfCorectAns++;
                console.log(sumOfCorectAns);
                
            }
            else  {
                sumOfUncorectAns++;
                
            }
            alert(`game over! correct answers: ${sumOfCorectAns} uncorrect unswers: ${sumOfUncorectAns}`);
            idx = 0;
            sumOfCorectAns = 0;
            sumOfUncorectAns = 0;
            $('.btn-group>button').off('click');
        }
        

    })
    



    
    // alert('end')
})
  