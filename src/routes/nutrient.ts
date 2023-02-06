import express from 'express';
import { logError } from '../lib/helpers';
import { errorMessages } from '../database/errors';
import { getFoodsWithSignificantNutrientAmount } from '../database/nutrients/read';

const nutrientRouter = express.Router();

type NutrientRequestBody = {
  age: number | string;
  gender: string;
  nutrientName: string;
  threshold?: number;
}

nutrientRouter.get('/nutrients/food', async (req, res) => {
  try {
    if (!req.query.nutrientName) {
      throw new Error(errorMessages.nutrients.nutrientNameUndefined);
    }
    
    // @ts-ignore
    const { age, gender, nutrientName, threshold } = req.query as NutrientRequestBody;
    const nutrients = await getFoodsWithSignificantNutrientAmount(nutrientName, gender, age, threshold);
    res.status(200).send(nutrients);
  } catch(err) {
    logError(err);
    res.status(500).send(err);
  }
});


export {
  nutrientRouter
};