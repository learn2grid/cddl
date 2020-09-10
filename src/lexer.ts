import { Token, Tokens } from './tokens';
import { isLetter, isDigit } from './utils'
import { WHITESPACE_CHARACTERS } from './constants';

export default class Lexer {
    input: string;
    position: number = 0;
    readPosition: number = 0;
    ch: number = 0;

    constructor (source: string) {
        this.input = source

        this.readChar()
    }

    private readChar (): void {
        if (this.readPosition >= this.input.length) {
            this.ch = 0
        } else {
            this.ch = this.input[this.readPosition].charCodeAt(0)
        }
        this.position = this.readPosition
        this.readPosition++
    }

    nextToken (): Token {
        let token: Token
        this.skipWhitespace()

        const Literal = String.fromCharCode(this.ch)
        switch (this.ch) {
            case '='.charCodeAt(0):
                token = { Type: Tokens.ASSIGN, Literal }
                break
            case ';'.charCodeAt(0):
                token = { Type: Tokens.SEMICOLON, Literal }
                break
            case '('.charCodeAt(0):
                token = { Type: Tokens.LPAREN, Literal }
                break
            case ')'.charCodeAt(0):
                token = { Type: Tokens.RPAREN, Literal }
                break
            case '{'.charCodeAt(0):
                token = { Type: Tokens.LBRACE, Literal }
                break
            case '}'.charCodeAt(0):
                token = { Type: Tokens.RBRACE, Literal }
                break
            case '['.charCodeAt(0):
                token = { Type: Tokens.LBRACK, Literal }
                break
            case ']'.charCodeAt(0):
                token = { Type: Tokens.RBRACK, Literal }
                break
            case '+'.charCodeAt(0):
                token = { Type: Tokens.PLUS, Literal }
                break
            case ','.charCodeAt(0):
                token = { Type: Tokens.COMMA, Literal }
                break
            case '.'.charCodeAt(0):
                token = { Type: Tokens.DOT, Literal }
                break
            case ':'.charCodeAt(0):
                token = { Type: Tokens.COLON, Literal }
                break
            case '?'.charCodeAt(0):
                token = { Type: Tokens.QUEST, Literal }
                break
            case '/'.charCodeAt(0):
                token = { Type: Tokens.SLASH, Literal }
                break
            case '"'.charCodeAt(0):
                token = { Type: Tokens.STRING, Literal: this.readString() }
                break
            case '#'.charCodeAt(0):
                token = { Type: Tokens.COMMENT, Literal: this.readComment() }
                break
            case 0:
                token = { Type: Tokens.EOF, Literal: '' }
                break
            default: {
                if (isLetter(Literal)) {
                    return { Type: Tokens.IDENT, Literal: this.readIdentifier() }
                } else if (isDigit(Literal)) {
                    const numberOrFloat = this.readNumberOrFloat()
                    return {
                        Type: numberOrFloat.includes(Tokens.DOT) ? Tokens.FLOAT : Tokens.NUMBER,
                        Literal: numberOrFloat
                    }
                }
                token = { Type: Tokens.ILLEGAL, Literal: '' }
            }
        }

        this.readChar()
        return token
    }

    private readIdentifier (): string {
        const position = this.position

        /**
         * an identifier can contain
         */
        while (
            /**
             * things that belong to identifier
             */
            (
                // a letter (a-z, A-Z)
                isLetter(String.fromCharCode(this.ch)) ||
                // a digit (0-9)
                isDigit(String.fromCharCode(this.ch)) ||
                // a minus ("-")
                this.ch === Tokens.MINUS.charCodeAt(0)
            )
            &&
            /**
             * things that don't belong into identifier
             */
            !(
                this.ch === Tokens.NL.charCodeAt(0)
            )
        ) {
            this.readChar()
        }

        return this.input.slice(position, this.position)
    }

    private readComment (): string {
        const position = this.position

        while (this.ch && String.fromCharCode(this.ch) !== '\n') {
            this.readChar()
        }

        return this.input.slice(position, this.position).trim()
    }

    private readString (): string {
        const position = this.position

        this.readChar() // eat "
        while (this.ch && String.fromCharCode(this.ch) !== Tokens.QUOT) {
            this.readChar() // eat any character until "
        }

        return this.input.slice(position + 1, this.position).trim()
    }

    private readNumberOrFloat (): string {
        const position = this.position

        while (isDigit(String.fromCharCode(this.ch)) || this.ch === Tokens.DOT.charCodeAt(0)) {
            this.readChar() // eat any character until "
        }

        return this.input.slice(position, this.position).trim()
    }

    private skipWhitespace () {
        while (WHITESPACE_CHARACTERS.includes(String.fromCharCode(this.ch))) {
            this.readChar()
        }
    }
}