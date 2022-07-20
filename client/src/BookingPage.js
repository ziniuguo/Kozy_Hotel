import React from "react";
import {Controller, useForm} from "react-hook-form";
import DatePicker from 'react-datepicker';
import styled from 'styled-components';
import 'react-datepicker/dist/react-datepicker.css';
import { emphasize } from "@mui/material";


const Styles = styled.div`

  form {
    border:1px solid #ffffff;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin: 0 auto;
    max-width: 600px;
    padding: 30px 40px;
  }

  input {
    border: 2px solid #737373;
    border-radius: 7px;
    padding: 6px;
    width: 100%;
  }

  select {
    border: 2px solid #737373;
    border-radius: 7px;
    padding: 6px;
    width: 98%;
  }

  label {
    color: #3d3d3d;
    display: block;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 5px;
  }

  .error {
    color: red;
    font-size: 12px;
    height: 12px;
    display: flex;

  }

  .submitButton {
    background-color: #6976d9;
    color: white;
    font-family: sans-serif;
    font-size: 14px;
    margin: 20px 0px;

`;

export default function BookingPage() {

    const { control, register, formState: { errors }, handleSubmit, reset } = useForm();

    

    function Error({ errors }) {
      return  <div className={"error"}>{errors ? errors.message : " "}</div>;
    }


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
      <Styles>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>

            <table>
              <tbody>
                <tr>
                  <td>
                  <div>
                      <label>Salutation: &nbsp;</label>
                      <select {...register("salutation", { required: "Salutation is required." })}>
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Miss">Miss</option>
                        <option value="Dr">Dr</option>
                        <option value="Sir">Sir</option>
                        <option value="Madam">Madam</option>
                        <option value="-">-</option>
                      </select>
                      <Error errors={errors.salutation} />
                    </div><br/>
                  </td>
                  <td>
                    <div>
                      <label>First name: &nbsp;</label>
                      <input type="text" size="20" {...register("firstName", {
                        required: "First name is required!", 
                        maxLength: 100}
                        
                        )} />
                      <Error errors={errors.firstName} />
                    </div><br/>
                  </td>

                  <td>
                    <div>
                      <label>Last name: &nbsp;</label>
                      <input type="text" size="20" {...register("lastName", {
                        required: "Last name is required!", 
                        maxLength: 100}
                        
                        )} />
                      <Error errors={errors.lastName} />
                    </div><br/>
                  </td>
                </tr>
              </tbody>
            </table>

            

            <div>
              <label>Phone number: &nbsp;</label>
              <input type="text" size="20" {...register("phoneNumber", {
                required: "Phone number is required"}
                
                )} />
              <Error errors={errors.phoneNumber} />
            </div><br/>

            <div>
              <label>Email address: &nbsp;</label>
              <input type="text" size="20" {...register("emailAddress", {
                required: "Email address is required", 
                pattern: {value: /^\S+@\S+$/i, message: "Invalid email address!"}}
                
                )} />
              <Error errors={errors.emailAddress} />
            </div><br/>

            <div>
              <label>Special requests (if any):  &nbsp;</label>
              <input type="textarea" size="40" {...register("specialRequests", {
                required: false}
                
                )} />
              <Error errors={errors.specialRequests} />
            </div><br/>
            
            <div>
            <label>Credit card number: &nbsp;</label>
              <input type="text" size="20" placeholder="**** **** **** ****" {...register("creditCardNumber", {
                required: "Credit card number is required", 
                minLength:16, 
                maxLength: 16, 
                pattern: {value: /^[0-9]+$/i, message: "Invalid credit card number!"}}
                
                )} />
              <Error errors={errors.creditCardNumber} />
            </div><br/>

            <table>
              <tbody>
                <tr>
                  <td>
                    <div>
                      <label>Credit card expiry date: &nbsp;</label>
                      <input type="text" size="8" placeholder="MM/YYYY" {...register("cardExpiry", {
                        required: "Credit card expiry date is required", 
                        pattern: {value: /^(0[1-9]|1[0-2])\/\d{4}$/, message: "Invalid expiry date!"}}
                        
                        )} />
                      <Error errors={errors.cardExpiry} />
                    </div><br/>
                  </td>

                  <td>
                    <div>
                      <label>CVV/CVC: &nbsp;</label>
                      <input type="password" size="8" placeholder="***" {...register("CVV_CVC", {
                        required: "CVV/CVC is required", 
                        pattern: {value: /^\d{3}$/, message: "Invalid CVV/CVC!"}}
                        
                        )} />
                      <Error errors={errors.CVV_CVC} />
                    </div><br/>
                  </td>
                </tr>
              </tbody>
            </table>

            <div>
              <label>Billing address: &nbsp;</label>
              <input type="text" size="40" {...register("billingAddress", 
              {required: "Billing address is required"}

                )} />
              <Error errors={errors.billingAddress} />
            </div><br/>
            
            

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
            <br/><br/>

      
            <input type="submit" className="submitButton"/>
          </form>
        </div>
        <p> </p>
      </Styles>
    );

};