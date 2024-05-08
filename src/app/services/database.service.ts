import { Injectable , WritableSignal, signal } from '@angular/core';
import { IDBUser } from '../interfaces/DB_Models';
import {CapacitorSQLite,SQLiteConnection,SQLiteDBConnection} from '@capacitor-community/sqlite';

const DB_USERS = 'dbusers';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private sqlite:SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!:SQLiteDBConnection;
  private users : WritableSignal<IDBUser[]> = signal<IDBUser[]>([]);

  constructor() { }

  async initialzPlugin(){

    this.db = await this.sqlite.createConnection(
          DB_USERS,
          false,
          "no-encryption",
          1,
          false
    );

    await this.db.open();

    const schema = `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        login TEXT NOT NULL,
        name TEXT NOT NULL,
        token TEXT NOT NULL
    );`;

    await this.db.execute(schema);

    this.fetchUsers();

    return true;

  }
  
  async addUser( login : string , name : string , token : string ){
    const query = ` INSERT INTO users (login,name,token) VALUES ( '${login}','${name}','${token}' ); `;
    const result = await this.db.query(query);
    this.fetchUsers();
    return result;
  }

  async updateUserById( id : string , token : string ){
    const query = ` UPDATE users SET token='${token}' WHERE id='${id}'; `;
    const result = await this.db.query(query);
    this.fetchUsers();
    return result;
  }

  async deleteUserById( id : string ){
    const query = `DELETE FROM users WHERE id='${id}';`;
    const result = await this.db.query(query);
    this.fetchUsers();
    return result;
  }

  async fetchUsers(){
    const users = await this.db.query("SELECT * FROM users WHERE id = 1;");
    this.users.set(users.values || []);
  }

  getUsers(){
    return this.users;
  }

  async fetchFirstUser():Promise<IDBUser>{
    
    let user:IDBUser = {id:0,name:'',login:'',token:''};
    
    await this.db.query(`SELECT * FROM users WHERE id=1 ;`) 
    .then((res)=>{
       const sqlUser:any[] = res.values || [];
       if(sqlUser[0])
          user = {id:sqlUser[0].id ,name:sqlUser[0].name,login:sqlUser[0].login,token:sqlUser[0].token};
      }
    );
    
    return user;
  
  }


}

