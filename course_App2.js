// course selling app storing in json file
const express = require('express')
const fs = require('fs')
const jst = require('jsonwebtoken')
const app = express();

app.use(express.json());