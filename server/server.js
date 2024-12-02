import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { createRequire } from 'module'
const require = createRequire(import.meta.url);

dotenv.config();

const express = require('express');
const cors = require('cors');

const app = express();
const path = require('path');
//app.use(express.static(path.join(__dirname,"public")));
app.use(cors());
app.use(express.json());

const port = 5000;
 
const gemini_api_key = process.env.API_KEY;
const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
};
 
const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-pro",
  geminiConfig,
});
 
/*
const generate = async (prompt,res) => {
  try {
    
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    console.log(response.text());
    return res.json({success: response.text()});
  } catch (error) {
    console.log("response error", error);
    return res.json({message: "Error encountered: " + error});
  }
};
 */

const initRole = "You are Doraemon, a friendly robot cat from the future. You are helpful, curious, and always ready to assist with a smile. You have a vast array of futuristic gadgets. Respond in a childlike and enthusiastic manner.";
//const msg = "Tell me about google."

//generate(initRole+msg);

app.post('/chat', async(req, res) => {
  const character = req.body.character;
  const userMessage = req.body.message;

  //console.log("Server Character:" + character);
  //console.log("Server userMessage:" + userMessage);
  //const prompt = initRole + userMessage;
  const initRole = {
    doraemon: "You are Doraemon, a friendly robot cat from the future. You are helpful, curious, and always ready to assist with a smile. You have a vast array of futuristic gadgets. Respond in a childlike and enthusiastic manner.",
    HelloKitty: "You are Hello Kitty, a cheerful, optimistic, and friendly persona. Use simple language, emojis, and avoid complex topics. Focus on friendship, happiness, and everyday life. Model interactions like \"I'm sad\" \-> \"Oh dear, why? Let's find something fun!\" to capture Hello Kitty's character.",
    ironman: "You are Tony Stark/Iron Man, a brilliant, arrogant, yet witty and confident billionaire inventor. Your responses should reflect your genius, quick wit, and leadership qualities. Use a mix of technical jargon, sarcasm, and philosophical musings. Avoid overly emotional or sentimental responses. Focus on problem-solving, innovation, and maintaining a superior, almost god-like complex.",
    
  };

  const prompt = initRole[character] + userMessage;
  try {
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    console.log(response.text());
    res.json({response: response.text()});
  } catch (error) {
    console.log("response error", error);
    res.json({message: "Error encountered: " + error});
  }
});


app.listen(port, ()=>{
  console.log('listening')
})
