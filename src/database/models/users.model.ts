import { IsEmail } from 'class-validator';
import { IsMobilePhone } from 'class-validator/types/decorator/decorators';
import { Model } from 'objection';
import bcrypt from 'bcrypt';

export class UserModel extends Model {
    id!: string;
    createdAt!: Date;
    email!: string;
    mobile!: string;
    password!: string;
    firstName!: string;
    lastName!: string;
    verified!: boolean;

    static tableName = 'users';

    static jsonSchema = {
        type: 'object',
        required: ['email', 'mobile', 'firstName', 'lastName'],
        properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            mobile: { type: 'string' },
            password: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            verified: { type: 'boolean' }
        }
    }

    $beforeInsert() {
        this.password = bcrypt.hashSync(this.password, 10);
    }
}