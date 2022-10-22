import * as chevrotain from "chevrotain";

let order = 0;
const { Lexer, CstParser } = chevrotain;
const allTokens: any = [];

const createToken = (options: any) => {
  const token = chevrotain.createToken(options);
  allTokens.push(token);
  return token;
};

createToken({
  name: `WhiteSpace`,
  pattern: /\s+/,
  group: Lexer.SKIPPED,
});

createToken({
  name: `N`,
  pattern: /\n/,
  group: Lexer.SKIPPED,
});

// const On = createToken({
//   name: `On`,
//   pattern: /on/,
// });

// const Off = createToken({
//   name: `Off`,
//   pattern: /off/,
// });

// const Brightness = createToken({
//   name: `Brightness`,
//   pattern: /brightness/,
// });

// const Color = createToken({
//   name: `Color`,
//   pattern: /color/,
// });

// const Wait = createToken({
//   name: `Wait`,
//   pattern: /wait/,
// });

// const Alias = createToken({
//   name: `Alias`,
//   pattern: /alias/,
// });

// const NUMBER = createToken({
//   name: `NUMBER`,
//   pattern: /\d+/,
// });

// const HEX_COLOR = createToken({
//   name: `HEX_COLOR`,
//   pattern: /#[a-fA-F0-9]{6}/,
// });

const Identifier = createToken({
  name: `Identifier`,
  pattern: /[a-zA-Z]+/,
});

const TO = createToken({
  name: `TO`,
  pattern: /\-*>/,
});

const FROM = createToken({
  name: `FROM`,
  pattern: /<\-*/,
});

const DESC = createToken({
  name: `DESC`,
  pattern: /\:.*/,
});

// end token
const LightLexer = new Lexer(allTokens);

class LightParser extends CstParser {
  constructor() {
    super(allTokens);
    const $ = this;

    // 定义规则

    $.RULE("program", () => {
      $.MANY(() => {
        $.SUBRULE($.sub);
      });
    });

    $.RULE("sub", () => {
      $.SUBRULE($.subjectClause);
      $.SUBRULE($.relationClause);
      $.OPTION(() => {
        $.SUBRULE($.descriptionClause);
      });
    });

    $.RULE("subjectClause", () => {
      $.CONSUME(Identifier);
    });

    $.RULE("relationClause", () => {
      $.OR([
        {
          ALT: () => $.CONSUME(FROM),
        },
        {
          ALT: () => $.CONSUME(TO),
        },
      ]);
      $.CONSUME(Identifier);
    });

    $.RULE("descriptionClause", () => {
      $.OPTION(() => {
        $.CONSUME(DESC);
      });
    });

    $.performSelfAnalysis();
  }
}

// const lexed = LightLexer.tokenize(
//   `alias green #00ff00 alias blue #0000ff alias delay 600 brightness 75 on wait delay color green wait delay color blue wait delay off`
// );
// const lexed = LightLexer.tokenize(
//   `Alice --> Bob: Authentication Request
//   Bob --> Alice: Authentication Response
//   Alice -> Bob: Another authentication Request
//   Alice <- Bob: Another authentication Response
//   `
// );

export const debug_parser = () => {
  const lexed = LightLexer.tokenize(`
  MRA --> MRC: Authentication Request 
  MRC <-- MRA: debug
  MRB --> MRC: debug2
  `);
  if (lexed.errors.length) {
    console.log(`Lexer error!`);

    console.log(lexed.errors);

    throw new Error();
  }

  const parser = new LightParser();

  parser.input = lexed.tokens;

  const cst = parser.program();
  console.log("cst: ", cst);
  if (parser.errors.length) {
    console.log(`Parser error!`);

    console.log(parser.errors);

    throw new Error();
  }

  const BaseCstVisitor = parser.getBaseCstVisitorConstructor();
  class LightInterpreter extends BaseCstVisitor {
    result: any;
    subject!: string;
    constructor() {
      super();

      this.light = {
        on: false,
        brightness: 100,
        color: `#ffffff`,
      };

      this.scope = {};

      this.validateVisitor();
      this.result = {
        nodes: [],
        edges: [],
      };
    }

    program(context) {
      console.log(context);
      context.sub.forEach((item) => {
        this.visit(item);
      });
      return this.result;
    }

    sub(context) {
      console.log("supreme");
      console.log(context);
      this.visit(context.subjectClause);
      this.visit(context.relationClause);
      this.visit(context.descriptionClause);
    }

    subjectClause(context) {
      console.log("subjectClause");
      console.log(context);
      // console.log(context["CHARACTER"][0]);
      this.subject = context["Identifier"][0].image;
      this.result.nodes.push({
        id: this.subject,
        name: this.subject,
      });
    }
    relationClause(context) {
      console.log("relationClause");
      console.log(context);
      // console.log(context["CHARACTER"][0]);
      this.target = context["Identifier"][0].image;
      // this.result.nodes.push({
      //   // id: Math.random().toString(36).slice(-6),
      //   id: this.target,
      //   name: this.target,
      // });

      this.result.edges.push({
        // id: Math.random().toString(36).slice(-6),
        shape: "line",
        source: this.subject,
        target: this.target,
        order: (order += 1),
      });
      console.error(this.result);
    }

    descriptionClause(context) {
      console.log("descriptionClause");
      console.log(context);
    }

    target(context) {
      console.log("target");
      console.log(context);
    }

    // statement(context) {
    //   if (context.subjectClause) {
    //     this.visit(context.subjectClause);
    //   } else if (context.relationClause) {
    //     this.visit(context.relationClause);
    //   } else if (context.descriptionClause) {
    //     this.visit(context.descriptionClause);
    //   } else if (context.target) {
    //     this.visit(context.target);
    //   }
    // }
  }

  const interpreter = new LightInterpreter();
  // // 请在 Console 中查看
  const res = interpreter.visit(cst);
  return res;
};
