const externalLib1 = require('externalLib1');
var { methodLib2, constant2 } = require( "src/internalLib3" );
import {methodLib1, constant1, aliasMethodLib1 as myAliasMethod1, unUsedAliasMethod1 as unusedMethod1} from 'externalLib1';
import path from 'path';
import externalLib2 from "externalLib2";
import { default as my_child_process } from 'child_process';
var {
  total,
  sum
} = require('stats')

const a = path.join('a1', 'a2')
const b = externalLib1(a);
const c = methodLib1() + constant1;
const d = myAliasMethod1(constant2);
const e = my_child_process();

const avg = total / sum;

methodLib2(a,b,c,d,e, avg)
