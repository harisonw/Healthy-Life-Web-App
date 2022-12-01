const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth-user.js");

//const AuthController = require("../controllers/AuthController");

const NewsAPI = require('newsapi');
const { default: mongoose } = require("mongoose");
const { findById } = require("../models/Post.js");
const newsapi = new NewsAPI('fe54e60e747c4e46b679a70c38379f11');

// for user health
const User = require("../models/User.js");

router.get ("/", auth, async (req, res) => {
    //create array
    searchTerms = [];

    // assess users health information
    user = await User.findById(req.user.id);
    console.log(user);

    // age
    if (user.age < 18) {
        searchTerms.push("teen");
        searchTerms.push("child");
    } else if (user.age < 30) {
        searchTerms.push("young adult");
    } else if (user.age < 50) {
        searchTerms.push("adult");
    } else {
        searchTerms.push("senior");
    }

    // BMI
    userBMI = user.weight / (user.height * user.height);
    NHS_MAX_BMI = 25;
    NHS_MIN_BMI = 18.5;
    if (user.BMI > NHS_MAX_BMI) {  
        searchTerms.push("overweight");
    } else if (user.BMI < NHS_MIN_BMI) {
        searchTerms.push("underweight");
    }

    // Exercise
    if (user.avgHrsExercisePW == "none" || user.exercise == "1") {
        searchTerms.push("exercise");
    }

    // Daily Steps
    if (user.avgStepsPD = "0-999" || user.avgStepsPD == "1000-1999" || user.avgStepsPD == "2000-3999" || user.avgStepsPD == "4000-6999" || user.avgStepsPD == "7000-9999") {
        searchTerms.push("steps");
    }

    // Eating Habits
    if (user.eatingHabits == "Very Unhealthy" || user.eatingHabits == "Unhealthy" || user.eatingHabits == "Bellow Average") {
        searchTerms.push("healthy eating");
    }

    // Sleep
    if (user.avgSleepHrsPD == "0-3" || user.avgSleepHrsPD == "4-5") {
        searchTerms.push("sleep");
    }

    // Alcohol
    if (user.avgUnitsAlcoholPW == "15-18" || user.avgUnitsAlcoholPW == "18+") {
        searchTerms.push("alcohol");
    }

    // Occupation
    if (user.occupation == "None" || user.occupation == "Other (Non-sedentary work)") {
    } else {
        searchTerms.push(user.occupation);
    }

    console.log("search terms: " + searchTerms);







    // make searchTerms into a string
    searchTermsString = searchTerms.join(" OR ");
    console.log("search terms string: " + searchTermsString);
    newsapi.v2.everything({
        q: searchTermsString,
        sources: 'bbc-news',
        domains: 'bbc.co.uk',
        from: '2022-11-07',
        to: '2022-12-01',
        language: 'en',
        sortBy: 'relevancy',
        page: 1
      }).then(response => {
        res.send(response);
        /*
          {
            status: "ok",
            articles: [...]
          }
        */
      });
});




module.exports = router;
