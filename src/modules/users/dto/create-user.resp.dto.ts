export class CreateUserResponseDto {
    code!: number 
    message!: string
    data:any


    constructor(code: number, message: string) {
        this.code = code;
        this.message = message;
    }
}