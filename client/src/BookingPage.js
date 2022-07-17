import React from "react";
import {useForm} from "react-hook-form";


export default function BookingPage() {
    // const {register, handleSubmit, formstate: {errors}, reset} = useForm();
    
    const { register, formState: { errors }, handleSubmit, reset } = useForm();

    const onSubmit = data => {
        console.log(data);
        var bookData = JSON.stringify(data, null, 4);
        alert(bookData);

        reset();
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
          <br/><input type="text" placeholder="First name" {...register("firstName", {required: true, maxLength: 80})} /><br/>
          {errors.firstName && <p>First name is required<br/></p>}

          <br/><input type="text" placeholder="Last name" {...register("lastName", {required: true, maxLength: 100})} /><br/>
          {errors.lastName && <p>Last name is required<br/></p>}

          <br/><input type="text" placeholder="Phone Number" {...register("phoneNumber", {required: true})} /><br/>
          {errors.phoneNumber && <p>Phone number is required<br/></p>}

          <br/><input type="text" placeholder="Email Address" {...register("emailAddress", {required: true, pattern: /^\S+@\S+$/i})} /><br/>
          {errors.emailAddress && <p>Email address is required<br/></p>}

          <br/><input type="text" placeholder="Special Requests" {...register("specialRequests", {required: false})} /><br/>
          {/* {errors.specialRequests && <p>Last name is required</p>} */}

          <br/><input type="text" placeholder="Credit Card Number" {...register("creditCardNumber", {required: true, maxLength: 16})} /><br/>
          {errors.creditCardNumber && <p>Credit card number is required<br/></p>}

    
          <input type="submit" />
        </form>
      );

};