const { EmbedBuilder, Events } = require("discord.js");
const { exit } = require("process");
const { cases } = require("./win_cases.json");
const client = require("./index.js");

const VALID_REACTIONS = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣"];

class Game {
    board = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
    ];
    signToPlay = 1;

    constructor(interaction, player1, player2) {
        this.interaction = interaction;
        this.player1 = player1;
        this.player2 = player2;

        this.printBoard(false);
    }

    handleReaction(reaction, user) {
        if (this.gameOver) return;

        // reset the reaction
        reaction.users.remove(user);
        // check if the user is allowed to play
        const userToPlayId = this.signToPlay == 1 ? this.player1.id : this.player2.id;
        if (user.id != userToPlayId) return;

        const column = VALID_REACTIONS.indexOf(reaction.emoji.name) + 1;
        const lowestEmptyTile = this.getLowestEmptyTileAtColumn(column);
        if (lowestEmptyTile > -1) {
            this.board[lowestEmptyTile][column - 1] = this.signToPlay;
        }

        if (this.checkWin()) {
            this.printBoard(true);
            this.gameOver = true;
            return;
        }

        this.signToPlay = this.signToPlay == 1 ? 2 : 1;

        this.printBoard(false);
    }

    checkWin() {
        for (let row = 0; row < this.board.length; row++) {
            for (let column = 0; column < this.board[0].length; column++) {
                if (this.isWinAtCoordinates(row, column)) {
                    return true;
                }
            }
        }
        return false;
    }

    isWinAtCoordinates(row, column) {
        for (const winCase of cases) {
            let localRow, localColumn;
            [localRow, localColumn] = [row, column];
            const directionIndeces = winCase.split("");
            if (this.getTileAtCoordinates(localRow, localColumn) != this.signToPlay) continue;
            [localRow, localColumn] = this.addToCoordinatesFromDirectionIndex(localRow, localColumn, directionIndeces[0]);
            if (this.getTileAtCoordinates(localRow, localColumn) != this.signToPlay) continue;
            [localRow, localColumn] = this.addToCoordinatesFromDirectionIndex(localRow, localColumn, directionIndeces[1]);
            if (this.getTileAtCoordinates(localRow, localColumn) != this.signToPlay) continue;
            [localRow, localColumn] = this.addToCoordinatesFromDirectionIndex(localRow, localColumn, directionIndeces[2]);
            if (this.getTileAtCoordinates(localRow, localColumn) == this.signToPlay) return true;
        }
    }

    getTileAtCoordinates(row, column) {
        if (row < 0) return 0;
        if (row >= this.board.length) return 0;
        if (column < 0) return 0;
        if (column >= this.board[0].length) return 0;
        return this.board[row][column];
    }

    addToCoordinatesFromDirectionIndex(row, column, directionIndex) {
        if (directionIndex == 1 || directionIndex == 2) column++;
        if (directionIndex == 2 || directionIndex == 3 || directionIndex == 4) row++;
        if (directionIndex == 4 || directionIndex == 5) column--;
        return [row, column];
    }

    getLowestEmptyTileAtColumn(column) {
        let lowestClearTile = this.board.length - 1;
        for (let i = 0; i < this.board.length; i++) {
            if (this.board[i][column - 1] != 0) {
                lowestClearTile = i - 1;
                break;
            }
        }
        return lowestClearTile;
    }

    async printBoard(showWinner) {
        let board = this.board.map((row) => row.join("")).join("\n");
        board = board.replace(/0/g, "⚪");
        board = board.replace(/1/g, "🔴");
        board = board.replace(/2/g, "🟡");
        board += "\n1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣";

        const exampleEmbed = new EmbedBuilder().setColor(0xc1bfff).setDescription(board);

        if (showWinner) {
            const winner = this.signToPlay == 1 ? this.player1 : this.player2;
            const loser = this.signToPlay == 1 ? this.player2 : this.player1;
            exampleEmbed.setTitle(`Omni4 - ${winner.globalName} won against ${loser.globalName}!`);
        } else {
            exampleEmbed.setTitle(`Omni4 - ${this.player1.globalName} vs ${this.player2.globalName}`);
        }

        if (this.message) {
            this.interaction.editReply({
                embeds: [exampleEmbed],
            });
        } else {
            await this.interaction.reply({
                embeds: [exampleEmbed],
            });
            await this.interaction.fetchReply().then((responseMsg) => {
                this.message = responseMsg;
                responseMsg.react("1️⃣");
                responseMsg.react("2️⃣");
                responseMsg.react("3️⃣");
                responseMsg.react("4️⃣");
                responseMsg.react("5️⃣");
                responseMsg.react("6️⃣");
                responseMsg.react("7️⃣");

                const collectorFilter = (reaction, user) => {
                    return VALID_REACTIONS.includes(reaction.emoji.name) && (user.id === this.player1.id || user.id === this.player2.id);
                };

                const collector = responseMsg.createReactionCollector({ filter: collectorFilter });

                const game = this;
                collector.on("collect", (reaction, user) => {
                    game.handleReaction(reaction, user);
                });
            });
        }
    }
}

module.exports = { Game };
