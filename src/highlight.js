import {styleTags, tags} from "@lezer/highlight"
//import {Number, String} from "./my.grammar.terms"


export const highlighting = styleTags({
  String: tags.string,
  Number: tags.number,
  "True False": tags.bool,
  PropertyName: tags.propertyName,
  Null: tags.null,
  ",": tags.separator,
  "[ ]": tags.squareBracket,
  "{ }": tags.brace
})