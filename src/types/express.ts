import { OpenidRequest } from 'express-openid-connect';
import express, { NextFunction, Request, Response } from 'express';

export type RequestOIDC = Request & OpenidRequest;
