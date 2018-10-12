'use strict';

const DB_VER = 0.14;

var Realm = require('realm');

const OrderSchema = {
    name: 'Order',
    // primaryKey: 'order_id',
    properties: {
        order_id: 'string',
        goods_id: 'string',
        seller_id: 'string',
        buyer_id: 'string',
        total_price: { type: 'double', default: 0 },
    }
};

const UserSchema = {
    name: 'User',
    // primaryKey: 'user_id',
    properties: {
        user_id: 'string',
        token: 'string',
        tel: { type: 'string', optional: true },
        type: { type: 'int', default: 0 },
    }
};

const GoodsPicSchema = {
    name: 'GoodsPic',
    properties: {
        url: 'string',
        iscover: { type: 'bool', default: false },
    }
};

const GoodsSchema = {
    name: 'Goods',
    properties: {
        goods_id: 'string',
        title: 'string',
        status: { type: 'int', default: 0 },
        price: { type: 'double', default: 0 },
        pics: { type: 'list', objectType: 'GoodsPic' },
    }
};


const UserListSchema = {
    name: 'UserList',
    properties: {
        users: { type: 'list', objectType: 'User' },
    }
};

class DBManager {

    constructor() {
        // 确保只有单例
        if (DBManager.unique !== undefined) {
            return DBManager.unique;
        }


        this.realm = new Realm({ path: DB_VER + '.realm', schema: [OrderSchema, UserListSchema, UserSchema], schemaVersion: DB_VER })
        DBManager.unique = this;
    }

    getRealm() {
        return this.realm;
    }

    async insertGoods2() {
        var realm = this.realm;
        this.realm.write(() => {
            // Create a book object
            console.log(new Date());
            for (let i = 0; i < 20000; i++) {
                realm.create('User', { user_id: 'a' + i, tel: '1', token: 'Recipes' }, true);
            }


            console.log(new Date());
        });
    }

    async insertGoods() {
        await this.insertGoods2();
    }
    //'Book', { id: 1, title: 'Recipes', price: 35 }
    saveData(tableName, data, needUpdate = false) {
        this.realm.write(() => {
            this.realm.create(tableName, data, needUpdate);
        });
    }

    getDatas(tableName) {
        return this.realm.objects(tableName);
    }

    clearDatas() {
        this.realm.write(() => {
            this.realm.deleteAll();
        });
    }

};



export default DBManager;