import externalLib1 from 'externalLib1';
import {methodLib1, constant1, aliasMethodLib1 as myAliasMethod1, unUsedAliasMethod1 as unusedMethod1} from 'externalLib1';
import path from 'path';
import externalLib2 from "externalLib2";
import {methodLib2, constant2} from "src/internalLib3";
import childProcess from 'child_process';

const a = path.join('a1', 'a2')
const b = externalLib1(a);
const c = methodLib1() + constant1;
const d = myAliasMethod1(constant2);
