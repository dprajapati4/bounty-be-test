"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.urlencoded({
    extended: true
}));
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server is running');
});
app.get('/api', (req, res) => {
    res.send('on api route');
});
const fetchData = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield axios_1.default.get(`https://pokeapi.co/api/v2/pokemon/${query}`);
    if (data) {
        return data;
    }
});
const removeDuplicates = (query) => {
    const queryArr = query.split(',');
    const uniqueQueries = [];
    queryArr.forEach((query) => {
        if (!uniqueQueries.includes(query)) {
            uniqueQueries.push(query);
        }
    });
    return uniqueQueries;
};
//https://pokeapi.co/api/v2/pokemon/{id or name}/
app.get('/pokemon-details', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pokemon = req.query.pokemon;
    try {
        const data = yield fetchData(pokemon);
        res.send(data);
    }
    catch (error) {
        console.log('Error fetching pokemon data', error);
    }
}));
// Error handling endware
app.use((err, req, res, next) => {
    console.error('Endware erroree', err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error');
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
