import React from "react";
import {Controller, useForm} from "react-hook-form";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


export default function BookingPage() {

    const { control, register, formState: { errors }, handleSubmit, reset } = useForm();

    const onSubmit = async (data) => {
        console.log(data.dateInput.getFullYear(), data.dateInput.getMonth() + 1, data.dateInput.getDate());
        let formatMonth = `${data.dateInput.getMonth() + 1}`.length == 1? `0${data.dateInput.getMonth() + 1}`:`${data.dateInput.getMonth() + 1}`;
        let formatDay = `${data.dateInput.getDate()}`.length == 1? `0${data.dateInput.getDate()}`: `${data.dateInput.getDate()}`;
        data.dateInput = `${data.dateInput.getFullYear()}-${formatMonth}-${formatDay}`;
        console.log(data);

        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }
        const response = await fetch('/booking', requestOptions)
        .catch((error) => {
          console.log(error)
        });
        console.log("done")
        const jsonData = await response.json();
        console.log(jsonData);


        // const response = await fetch('/hotelsprices_givendest')
        // .catch((error) => {
        //   console.log(error)
        // });
        // console.log("done")
        // const jsonData = await response.json();
        // console.log(jsonData);


        alert("Booking confirmed! Enjoy your trip!");

        reset();
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
          <br/><input type="text" placeholder="First name" {...register("firstName", {required: true, maxLength: 100})} /><br/>
          {errors.firstName && <p>First name is required<br/></p>}

          <br/><input type="text" placeholder="Last name" {...register("lastName", {required: true, maxLength: 100})} /><br/>
          {errors.lastName && <p>Last name is required<br/></p>}

          <br/><input type="text" placeholder="Phone Number" {...register("phoneNumber", {required: true})} /><br/>
          {errors.phoneNumber && <p>Phone number is required<br/></p>}

          <br/><input type="text" placeholder="Email Address" {...register("emailAddress", {required: true, pattern: /^\S+@\S+$/i})} /><br/>
          {errors.emailAddress && <p>Email address is required<br/></p>}

          <br/><input type="text" placeholder="Special Requests" {...register("specialRequests", {required: false})} /><br/>
          {/* {errors.specialRequests && <p>Last name is required</p>} */}

          <br/><input type="password" placeholder="Credit Card Number" {...register("creditCardNumber", {required: true, maxLength: 16})} /><br/>
          {errors.creditCardNumber && <p>Credit card number is required<br/></p>}
          <br/>

          <Controller
            control={control}
            name='dateInput'
            render={({field}) => (
              <DatePicker
                placeholderText="Select start date"
                onChange={(date) => field.onChange(date)}
                selected={field.value}
              />
            )}
          />
          <br/>

    
          <input type="submit" />
        </form>
      );

};