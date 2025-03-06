import { EyeSlashIcon, EyeIcon, EnvelopeIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/solid';
import { Input, Checkbox, Button, Typography, Dialog, DialogBody, Badge, } from "@material-tailwind/react";
import React, { useState } from 'react';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../utils/firebase';

const schema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email field is required'),
  password: yup.string().required('Password is required'),
})

const cls = ['before:content-none after:content-none', 'placeholder:opacity-100 !border focus:!border-primary/90'];

export default function AdminLogin() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const handleOpen = () => { setOpen(!open); setSent(false) };
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => setPasswordShown((cur) => !cur);
  const { register, handleSubmit, formState: { errors }, } = useForm({ resolver: yupResolver(schema), })
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      // console.log(formData);
      const result = await adminLogin(formData.email, formData.password);
      if (result.success) {
        navigate("/admin"); // Redirect after login
        toast.success("You've successfully logged in.");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }
  const sendMail = async () => {
    setLoading(true);
    try {
      toast.success('Submission Successfully.');
    } catch (error) {
      toast.error('Submission failed.');
    } finally {
      setLoading(false); setOpen(false);
    }
  }
  return (
    <React.Fragment>
      <Typography variant="h4">Admin Signin</Typography>
      <Typography className="mt-1 font-normal">
        Welcome back login to your panel
      </Typography>
      <form method='post' className="mt-8 mb-2 text-fore" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-1 flex flex-col gap-6">
          <div>
            <label htmlFor="email" className="-mb-3 text-fore">Your Email</label>
            <Input placeholder="email@mail.com" {...register('email')} className={cls[1]} labelProps={{ className: cls[0], }} error={errors.email} />
            {errors.email && <Typography color="red" className="mt-2 text-xs font-normal">
              {errors.email.message}
            </Typography>}
          </div>
          <div>
            <label htmlFor="password" className="-mb-3 text-fore">Password</label>
            <Input type={passwordShown ? "text" : "password"} {...register('password')} placeholder="Enter password" className={cls[1]} icon={<i onClick={togglePasswordVisiblity}>{passwordShown ? (<EyeIcon className="h-5 w-5" />) : (<EyeSlashIcon className="h-5 w-5" />)}</i>} labelProps={{ className: cls[0], }} />
            {errors.password && <Typography color="red" className="mt-2 text-xs font-normal">{errors.password.message}</Typography>}
          </div>
        </div>
        <div className='flex justify-between items-center mt-3'>
          <Checkbox label={<Typography variant="small" className="flex items-center font-normal text-fore">Remember me</Typography>} containerProps={{ className: "-ml-2.5" }} className='checked:bg-primary' />
          <Button variant='text' onClick={handleOpen} className='text-primary capitalize'>Forgot Password?</Button>
        </div>
        <Button type="submit" className={`mt-6 bg-primary disabled:!pointer-events-auto disabled:cursor-not-allowed justify-center`} loading={loading} fullWidth>
          Login
        </Button>
      </form>
      <Dialog open={open} handler={handleOpen} size="sm">
        {!sent ? (
          <DialogBody divider className="grid place-items-center gap-4 md:p-16 relative border-0 bg-header">
            <XMarkIcon className="mr-3 h-5 w-5 absolute top-3 right-0" onClick={handleOpen} />
            <EnvelopeIcon className='size-16 text-fore' />
            <Typography variant="h4" className='text-center text-fore'>
              Send Mail to Your Email?
            </Typography>
            <Typography className="text-center font-normal">
              A mail will be send to your registered email with a link to change password
            </Typography>
            <Button className={`bg-primary disabled:!pointer-events-auto disabled:cursor-not-allowed justify-center`} loading={loading} onClick={sendMail} fullWidth>
              Send Mail
            </Button>
          </DialogBody>) :
          (
            <DialogBody divider className="grid place-items-center gap-4 md:p-16 relative">
              <XMarkIcon className="mr-3 h-5 w-5 absolute top-3 right-0" onClick={handleOpen} />
              <Badge content={<CheckIcon className="h-4 w-4 text-white" strokeWidth={2.5} />} className="top-2 right-1 bg-gradient-to-tr from-green-400 to-green-600 border-2 border-white shadow-lg shadow-black/20"
              >
                <EnvelopeIcon className='size-16 text-fore' />
              </Badge>
              <Typography variant="h5" className='text-center text-fore'>
                A mail has been sent to your registered email
              </Typography>
              <Typography className="text-center font-normal">
                Click the link in the mail description to change password
              </Typography>
            </DialogBody>)}
      </Dialog>
    </React.Fragment>
  );
}