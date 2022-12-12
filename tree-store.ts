type ID = string | number;
type Method = 'getItem' | 'getChildren' | 'getAllChildren' | 'getAllParents';

interface ITreeItem {
    id: number,
    parent: number | string,
    type?: string | null
}

class TreeStore {
    /**
     * Массив данных
     */
    readonly items: ITreeItem[];
    /**
     * Хранилище данных
     */
    state: { [key: string]: any } = {};

    constructor(items: ITreeItem[]) {
        this.items = items;
    }

    /**
     * Берёт данные из хранилища
     * @param methodName - название метода (ключ в хранилище)
     * @param key - id элемента данные которого берём
     * @private
     */
    private getStateData(methodName: Method, key: ID): any {
        if (methodName in this.state && this.state[methodName][key]) {
            return this.state[methodName][key];
        }

        return null;
    }

    /**
     * Сохраняет данные в хранилище
     * @param methodName - название метода (ключ в хранилище)
     * @param key - id элемента
     * @param data - данные которого сохраняем
     * @private
     */
    private setStateData(methodName: Method, key: ID, data: any): void {
        if (!data) {
            return;
        }

        if (methodName in this.state) {
            this.state[methodName][key] = data;
        } else {
            this.state = {
                ...this.state,
                [methodName]: {
                    [key]: data
                }
            };
        }
    }

    /**
     * Возвращает изначальный массив элементов
     */
    getAll(): ITreeItem[] {
        return this.items;
    }

    /**
     * Возвращает объект элемента по id
     * @param id - id элемента
     */
    getItem(id: ID): ITreeItem | undefined {
        const savedData = this.getStateData('getItem', id);

        if (savedData) {
            return savedData;
        }

        const result: any = this.items.find(item => item.id === id);

        this.setStateData('getItem', id, result);

        return result;
    }

    /**
     * Возвращает массив элементов, являющихся дочерними для элемента с заданным id
     * @param id - id родителя
     */
    getChildren(id: ID): ITreeItem[] {
        const savedData = this.getStateData('getChildren', id);

        if (savedData) {
            return savedData;
        }

        const result = this.items.filter(item => item.parent === id);

        this.setStateData('getChildren', id, result);

        return result;
    }

    /**
     * Возвращает массив элементов, являющихся дочерними для элемента с заданным id и всеми дочерними элементами
     * @param id - id элемента
     */
    getAllChildren(id: ID): ITreeItem[] {
        const savedData = this.getStateData('getAllChildren', id);

        if (savedData) {
            return savedData;
        }

        const resultArray: ITreeItem[] = [];
        const arrayChildren: ITreeItem[] = this.getChildren(id);

        arrayChildren.forEach((elem) => {
            const child: any = this.items.find(item => item.parent === elem.id);

            if (!child) {
                return;
            }

            resultArray.push(...this.getAllChildren(elem.id));
        });

        const result = [...arrayChildren, ...resultArray];

        this.setStateData('getAllChildren', id, result);

        return result;
    }

    /**
     * Возвращает массив из элемента и цепочки родительских элементов
     * @param id - id элемента
     */
    getAllParents(id: ID): ITreeItem[] {
        const savedData = this.getStateData('getAllParents', id);

        if (savedData) {
            return savedData;
        }

        const resultArray: ITreeItem[] = [];
        const item = this.getItem(id);
        const isHasParent: boolean = Boolean(item?.parent && item.parent !== 'root');

        if (isHasParent) {
            const parent: any = this.getItem(item.parent);

            resultArray.push(parent, ...this.getAllParents(item.parent));
        }

        this.setStateData('getAllParents', id, resultArray);

        return resultArray;
    }
}

const items = [
    { id: 1, parent: 'root' },
    { id: 2, parent: 1, type: 'test' },
    { id: 3, parent: 1, type: 'test' },

    { id: 4, parent: 2, type: 'test' },
    { id: 5, parent: 2, type: 'test' },
    { id: 6, parent: 2, type: 'test' },

    { id: 7, parent: 4, type: null },
    { id: 8, parent: 4, type: null },
];

const ts = new TreeStore(items);

console.log('getAll');
console.log(ts.getAll());

console.log('getItem');
console.log(ts.getItem(7));

console.log('getChildren');
console.log(ts.getChildren(4));
console.log(ts.getChildren(5));
console.log(ts.getChildren(2));

console.log('getAllChildren');
console.log(ts.getAllChildren(2));

console.log('getAllParents');
console.log(ts.getAllParents(7));
