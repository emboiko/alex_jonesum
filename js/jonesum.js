const fs = require("fs");

/**
 * Min & Max inclusive
 * @param {Number} min 
 * @param {Number} max 
 */
const randInt = (min, max) => {
    return Math.floor(Math.random()*(max-min+1))+min
}


class AlexJones {
    constructor (){
        const isms = fs.readFileSync("../isms.txt");
        this.isms = isms.toString().split("\r\n");
        this.isms.sort(() => Math.random() - 0.5);
    }

    pontificate(sep=" ", end="."){
        const isms = this.isms;
        const pontifications = [];

        const count = randInt(4,8);
        for (let i=0; i<count; i++){
            pontifications.push(isms.pop());
        } 

        if (randInt(1,2) > 1) {
            const punctuation_index = randInt(0, count-3);
            pontifications[punctuation_index] = pontifications[punctuation_index] + ",";
        }

        pontifications[0] = pontifications[0][0].toUpperCase() + pontifications[0].slice(1);
        return pontifications.join(sep) + end;
    }

    rant(count=null){
        const heavy_knowledge = [];

        let range = count;
        if (!count) {
            range = randInt(4,8);
        }

        const angry_index = randInt(0,count-1);

        for (let i=0; i<range; i++) {
            if ((i == angry_index) && randInt(1,4) > 3) {
                heavy_knowledge.push(this.pontificate().toUpperCase().replace(".","!"));
            } else {
                heavy_knowledge.push(this.pontificate());

            }
        }

        return heavy_knowledge.join(" ");
    }
}

module.exports = AlexJones;