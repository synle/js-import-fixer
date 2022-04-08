import externalLib1 from 'externalLib1';
import {
  aliasMethodLib1 as myAliasMethod1,
  unUsedAliasMethod1 as unusedMethod1,
  constant1
} from 'externalLib1';
import externalLib2 from "externalLib2";
import {unUsedAliasMethod1 as unusedMethod1} from 'externalLib1';
import {methodLib1} from 'externalLib1';
import {methodLib2, constant2} from "externalLib2";
import {aliasMethodLib1 as myAliasMethod1} from 'externalLib1';

var a1 = constant1;
methodLib1();
externalLib1();
myAliasMethod1();

var a2 = constant2;
var temp2 = externalLib2();
