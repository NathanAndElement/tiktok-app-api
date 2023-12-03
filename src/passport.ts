import 'dotenv/config';
import './db';
import express, { Express } from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from './models/db/User';
import sendgrid from '@sendgrid/mail';
import AuthClass from './classes/AuthClass';
const { auth } = require('express-openid-connect');
const session = require('express-session');
const app: Express = express();
var MagicLinkStrategy = require('passport-magic-link').Strategy;

export const passportConfig = () => {};
