
import { enviroment } from "src/app/enviroments/enviroment"

export class CommandURL {
    // Customer
    public static CUSTOMER = enviroment.PROCESS_SERVICE + '/api/booking/customer';

    // Booking
    public static BOOKING = enviroment.PROCESS_SERVICE + '/api/booking/bookingInfo';

    // Employee
    public static EMPLOYEE = enviroment.PROCESS_SERVICE + '/api/booking/employee';

    //MEnu
    public static MENU = enviroment.PROCESS_SERVICE + '/api/booking/menu';

    // Login 
    public static LOGIN = enviroment.PROCESS_SERVICE + '/api/booking/auth';

    // user
    public static USER = enviroment.PROCESS_SERVICE + '/api/booking/user';

    // Calendar
    public static CALENDAR = enviroment.PROCESS_SERVICE + '/api/booking/calendarWorking';



}