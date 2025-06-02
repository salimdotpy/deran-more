import { Input, Button, Typography, CardBody, Card, Textarea, Avatar, Dialog, DialogBody, Option, Select, CardHeader, CardFooter } from "@material-tailwind/react";
import React, { useEffect, useMemo, useState } from 'react';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { BiEnvelope, BiLogoFacebookCircle, BiLogoGithub, BiLogoTelegram, BiLogoTiktok, BiLogoTwitter, BiLogoWhatsapp, BiPhoneCall, BiSupport } from "react-icons/bi";
import { MagnifyingGlassIcon, QuestionMarkCircleIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { BreadCrumbs } from "../sections";
import { ImageSchema } from "./settings";
import { frontContent, removeElement } from "../../utils/frontend";

const cls = ['!text-fore peer-focus:pl-0 peer-focus:before:!border-primary/90 peer-focus:after:!border-primary/90', 'text-fore focus:border-primary/90 placeholder:opacity-100'];

const DEFAULT_MESSAGES = {
  INVALID_KEY: "Invalid Key",
  INVALID_ID: "Invalid ID",
  CONFIRM_DELETE: "Are you sure to delete this item? Once deleted cannot be undone.",
};

export const social_icons = {
  facebook: BiLogoFacebookCircle,
  github: BiLogoGithub,
  whatsapp: BiLogoWhatsapp,
  telegram: BiLogoTelegram,
  twitter: BiLogoTwitter,
  tiktok: BiLogoTiktok,
  email: BiEnvelope,
  call: BiPhoneCall,
  question: QuestionMarkCircleIcon,
  support: BiSupport,
  card: CreditCardIcon,
}


export const keyToTitle = (text, multi = false, joint='_') => {
  const words = text.split(joint).map((word) => word[0].toUpperCase() + word.slice(1));
  return multi ? words.join(" ") : words.join(" ");
};

const validation = (content) => {
  const valid = {};
  Object.entries(content).forEach(([keyName, item]) => {
    if (keyName === "images") {
      Object.keys(item).forEach((imgKey) => {
        valid[`image_inputA${imgKey}Z`] = ImageSchema.image_input;
      });
    } else if (keyName !== "modal") {
      valid[keyName] = yup.string().required(`${keyToTitle(keyName)} is a required field`);
    }
  });
  return valid;
};

export const toggleHandler = (stateUpdater) => () => stateUpdater((prev) => !prev);

const handleFileChange = (e, fieldName, setPreviews, setValue, clearErrors) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews((prev) => ({
        ...prev,
        [fieldName]: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  }
  setValue(fieldName, file);
  clearErrors(fieldName);
};

export function Contents({ data }) {
  const { section, content, elements, key, pageTitle, emptyMessage, imgCount } = data;

  const schema = yup.object(validation(section.content || {}))
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState({});
  const [openModal, setOpenModal] = React.useState(false);
  const [modalData, setModalData] = React.useState({});

  // DataTable
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); const t_rows = elements || [];

  const filteredRows = useMemo(() => {
    return t_rows.filter((row) => {
      return Object.values(row?.data_values).some((value) =>{        
        return String(value).toLowerCase().includes(searchQuery.toLowerCase())
      }
      );
    });
  }, [searchQuery, t_rows]);
  const sortedRows = useMemo(() => {
    if (!sortConfig.key) return filteredRows;
    const sortedData = [...filteredRows].sort((a, b) => {
      if (a?.data_values?.[sortConfig.key] < b?.data_values?.[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a?.data_values?.[sortConfig.key] > b?.data_values?.[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sortedData;
  }, [filteredRows, sortConfig]);
  // Pagination
  const totalPages = Math.ceil(sortedRows.length / rowsPerPage);
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedRows.slice(startIndex, startIndex + rowsPerPage);
  }, [currentPage, sortedRows, rowsPerPage]);
  // Handlers
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  };

  // Calculate the range for "Showing X to Y of Z entries"
  const showingStart = (currentPage - 1) * rowsPerPage + 1;
  const showingEnd = Math.min(showingStart + rowsPerPage - 1, sortedRows.length);

  const { register, handleSubmit, reset, setValue, clearErrors, formState: { errors }, } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (data && section?.content) {
      let res = {};
      Object.entries(section.content).map(([keyName, item]) => {
        if (keyName === 'images') {
          Object.entries(item).map(([imgKey, image], index) => {
            let prevImg = content?.data_values?.[imgKey];
            prevImg = prevImg ? prevImg : `/images/default.png`;
            const imgName = `image_inputA${imgKey}Z`;
            res[imgName] = prevImg;
            setPreviews((prev) => ({ ...prev, imgName: prevImg, }));
          })
          }else {
            res[keyName] = content?.data_values?.[keyName];
          }
      });
      reset({ key: key, type: "content", ...res, });
    }
  }, [data, reset, section, key]);

  const toggleModal = (value) => setOpenModal(openModal === value ? 0 : value);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
        const response = await frontContent({...formData, ...previews});
        response.message ? toast.success(response.message) : toast.error(response.error);
    } catch (error) {
      toast.error('Submission failed. ' + error);
    } finally {
      setLoading(false);
    }
  }

  const renderContentImages = () => {
    if (!section.content) return null;

    return Object.entries(section.content).map(([keyName, item]) => {
      if (keyName === 'images') {
        return Object.entries(item).map(([imgKey, image], index) => {
          let prevImg = content?.data_values?.[imgKey];
          prevImg = prevImg ? prevImg : `/images/default.png`;
          const imgName = `image_inputA${imgKey}Z`;

          return (
            <div key={imgKey} className="w-full md:w-1/3 text-center">
              <input type="hidden" name="has_image" value="1" />
              <label htmlFor={`imgUpload${index}`}>
                <img src={previews[imgName] || prevImg || ''} alt="profile" className="w-full h-auto" />
              </label>
              <input type="file" name={imgName} id={`imgUpload${index}`} accept=".png, .jpg, .jpeg" onChange={(e) => handleFileChange(e, imgName, setPreviews, setValue, clearErrors)} className="hidden" />
              {errors[imgName] && (
                <Typography className="font-medium text-red-900" textGradient>
                  {errors[imgName].message}
                </Typography>
              )}
              <label htmlFor={`imgUpload${index}`} className="mt-3 align-middle cursor-pointer select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg border hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] block w-full text-fore border-fore">
                Upload {imgKey}
              </label>
              <small>
                Supported files: <b>jpeg, jpg, png</b>.
                {section.content.images[imgKey]?.size && (
                  <>
                    | Will be resized to: <b>{section.content.images[imgKey].size}</b> px.
                  </>
                )}
              </small>
            </div>
          );
        });
      }
    });
  };

  const renderContentFields = () => {
    if (!section.content) return null;

    return Object.entries(section.content).map(([keyName, item]) => {
      if (keyName !== 'images') {
        const Component = item === 'textarea' ? Textarea : Input;
        return (
          <div key={keyName} className="basis-1/3 grow">
            <Component
                {...register(keyName)}
                defaultValue={content?.data_values?.[keyName]}
                label={keyToTitle(keyName, true)} labelProps={{ className: cls[0] }} containerProps={{ className: 'min-w-0 w-full flex-1' }} className={cls[1]} error={errors[keyName]}
              />
            {errors[keyName] && <Typography color="red" className="mt-2 text-xs font-normal">
              {errors[keyName].message}
            </Typography>}
          </div>
        );
      }
    });
  };

  return (
    <React.Fragment>
      <Typography variant="h5" className="mb-4 text-fore">{pageTitle}</Typography>
      <BreadCrumbs separator="/" className='my-3 bg-header' links={[{ name: pageTitle, href: '' }]} />
      {section.content &&
        <Card className="bg-header text-fore">
          <CardBody>
            <form className="mb-2 mt-2 text-fore" onSubmit={handleSubmit(onSubmit)}>
              <input type="hidden" {...register('key')} defaultValue={key} />
              <input type="hidden" {...register('type')} defaultValue="content" />
              <div className="flex flex-wrap w-full">
                {renderContentImages()}
                <div className={`w-full ${imgCount && 'md:w-2/3 py-5 px-0 md:py-0 md:pl-5'}`}>
                  <div className="mb-1 flex flex-col gap-6">
                    {renderContentFields()}
                  </div>
                </div>
              </div>
              <Button type="submit" className="mt-6 bg-primary disabled:!pointer-events-auto disabled:cursor-not-allowed justify-center" loading={loading} fullWidth>
                Update
              </Button>
            </form>
          </CardBody>
        </Card>}
      {section.element &&
        <Card className="bg-header text-fore mt-10">
          <CardHeader floated={false} shadow={false} className="rounded-none bg-header text-fore">
            <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
              <Typography variant="h6">{pageTitle}'s Elements</Typography>
              <div className="flex w-full shrink-0 gap-2 md:w-max">
                {section.element.modal ?
                  <Button variant="outlined" size="sm" className="border-primary text-fore" onClick={() => { setModalData({ section: section, key: key }); toggleModal(1) }}>Add New</Button>
                  :
                  <Link to={`/admin/frontend/${key}`}>
                    <Button size="sm" variant="outlined" className="border-primary text-fore">
                      Add New
                    </Button>
                  </Link>
                }
              </div>
            </div>
          </CardHeader>
          <CardBody className="px-0 bg-header">
            <div className="flex items-center gap-2 justify-between px-4 pb-2">
              <div className="flex items-center gap-2">
                <Typography variant="small" className="text-fore">
                  Show
                </Typography>
                <Select menuProps={{ className: 'max-h-40 md:max-h-40 bg-header text-fore flex !flex-row flex-wrap gap-2' }} labelProps={{ className: cls[0] }} className={cls[1]}  value={rowsPerPage.toString()} onChange={(e) => handleRowsPerPageChange(e)} containerProps={{ className: '!min-w-20' }}>
                  <Option value="5">5</Option>
                  <Option value="10">10</Option>
                  <Option value="25">25</Option>
                  <Option value="50">50</Option>
                  <Option value="100">100</Option>
                </Select>
                <Typography variant="small" className="text-fore">
                  entries
                </Typography>
              </div>
              <Input label="Search" labelProps={{ className: cls[0] }} className={cls[1]}  containerProps={{ className: '!min-w-28 md:w-48' }} icon={<MagnifyingGlassIcon className="size-5" />} value={searchQuery} onChange={handleSearch} />
            </div>
            <div className="overflow-auto">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    <th className="border-b bg-primary/20 p-4 cursor-pointer" onClick={() => handleSort('sn')}>
                      <Typography variant="small" className="font-bold text-fore leading-none opacity-70">
                        SN
                      </Typography>
                    </th>
                    {section.element.images &&
                      <th className="border-b bg-primary/20 p-4 cursor-pointer" onClick={() => handleSort('image')}>
                        <Typography variant="small" className="font-bold text-fore leading-none opacity-70">
                          Image
                        </Typography>
                      </th>
                    }
                    {Object.entries(section.element).map(([k, type]) => (
                      k !== 'modal' && k !== 'images' && type !== 'nicedit' && (
                        <th key={k} className="border-b bg-primary/20 p-4 cursor-pointer" onClick={() => handleSort(k)}>
                          <Typography variant="small" className="font-bold text-fore  leading-none opacity-70">
                            {keyToTitle(k)}
                          </Typography>
                        </th>
                      )
                    ))}
                    <th className="border-b bg-primary/20 p-4 cursor-pointer">
                      <Typography variant="small" className="font-bold text-fore leading-none opacity-70">
                        Actions
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRows.length > 0 ? paginatedRows.map((record, index) => {
                    const isLast = index === paginatedRows.length - 1;
                    const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                    let prevImg = ' ';
                    if (section.element.images) {
                      const firstKey = Object.keys(section.element.images)[0];
                      prevImg = record?.data_values?.[firstKey];
                    }
                    const fields = Object.entries(section.element).map(([k, type], i) => {
                      if (k !== 'modal' && k !== 'images') {
                        if (type === 'icon') {
                          const SIcon = social_icons[record?.data_values?.[k]]
                          return (
                            <td className={classes} key={i}>
                              {SIcon && <SIcon className="size-7" />}
                            </td>
                          )
                        } else if (type !== 'nicedit') {
                          return (
                            <td className={classes} key={i}>
                              <Typography variant="small" className="font-normal text-fore">
                                {record?.data_values?.[k]}
                              </Typography>
                            </td>
                          )
                        }
                      }
                    });
                    return (
                      <tr key={index}>
                        <td className={classes}>
                          <Typography variant="small" className="font-normal text-fore">
                            {index + 1}
                          </Typography>
                        </td>
                        {section.element.images && (
                          <td>
                            <Avatar src={prevImg} alt="element image" />
                          </td>
                        )}
                        {fields}
                        <td className={classes}>
                          {section.element.modal ?
                            <Button color="blue" size="sm" variant="outlined" className="mr-2" onClick={() => { setModalData({ section: section, key: key, record: record }); toggleModal(2) }}>
                              Edit
                            </Button> :
                            <Link to={`/admin/frontend/${key}/${record?.id}`}>
                              <Button color="blue" size="sm" variant="outlined" className="mr-2">
                                Edit
                              </Button>
                            </Link>
                          }
                          <Button color="red" size="sm" variant="outlined" onClick={() => { setModalData({ id: record?.id }); toggleModal(3) }}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    )
                  }) :
                    <tr>
                      <td className='p-4' colSpan="100%">
                        <Typography variant="small" className="font-normal text-fore">
                          {emptyMessage}
                        </Typography>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </CardBody>
          <CardFooter className="flex flex-wrap items-center justify-between border-t border-blue-gray-50 gap-2 p-4">
                <Typography variant="small" className="text-fore">
                    Showing {showingStart} to {showingEnd} of {sortedRows.length} entries
                </Typography>
                <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className="disabled:!pointer-events-auto disabled:cursor-not-allowed">
                        Previous
                    </Button>
                    {[...Array(totalPages).keys()].map((page) => (
                        <Button key={page + 1} size="sm" variant={currentPage === page + 1 ? "filled" : "text"} onClick={() => handlePageChange(page + 1)} className={`${currentPage === page + 1 ? 'bg-primary' : 'text-fore'}`}>
                            {page + 1}
                        </Button>
                    ))}
                    <Button size="sm" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} className="disabled:!pointer-events-auto disabled:cursor-not-allowed">
                        Next
                    </Button>
                </div>
            </CardFooter>
        </Card>
      }
      <AddModal open={openModal === 1} handler={() => toggleModal(1)} data={modalData} />
      <EditModal open={openModal === 2} handler={() => toggleModal(2)} data={modalData} />
      <DeleteModal open={openModal === 3} handler={() => toggleModal(3)} data={modalData} />
    </React.Fragment>
  );
}

const AddModal = ({ open, handler, data }) => {
  const { section, key } = data || {};
  const schema = yup.object(validation(section?.element || {}));
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState({});
  const { register, handleSubmit, setValue, reset, clearErrors, formState: { errors }, } = useForm({
    resolver: yupResolver(schema),
  });

  // Reset form values whenever `data` changes
  useEffect(() => {
    if (data && section) {
      reset({ key: key, type: "element", ...section?.element, });

      // Set initial image previews
      if (section?.element?.images) {
        Object.keys(section.element.images).forEach((imgKey) => {
          setPreviews((prev) => ({ ...prev, [`image_inputA${imgKey}Z`]: '/images/default.png', }));
        });
      }
    }
  }, [data, reset, section, key]);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await frontContent(formData);
      response.message ? toast.success(response.message) : toast.error(response.error);
      window.location.reload()
    } catch (error) {
      toast.error(`Submission failed. ${error}`);
    } finally {
      setLoading(false);
      handler();
    }
  }

  return (
    <Dialog open={open} handler={handler} size="md" className='bg-header'>
      <DialogBody className="text-fore">
        <XMarkIcon className="mr-3 h-5 w-5 absolute z-10 top-3 right-0" onClick={handler} />
        {key ? (<Card color="transparent" shadow={false} className='w-full text-fore'>
          <Typography variant="h5">Add New {keyToTitle(key)} Item</Typography>
          <hr className="w-full my-3" />
          <form className="mb-2 mt-2 text-fore" onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" {...register('key')} defaultValue={key} />
            <input type="hidden" {...register('type')} defaultValue="element" />
            <div className="mb-1 flex flex-col gap-6 px-2 pt-3 w-full max-h-[60vh] overflow-y-auto">
              {Object.entries(section.element).map(([k, type], index) => {
                if (k === 'images') {
                  return (
                    <div className="w-full flex gap-5 flex-wrap" key={index}>
                      {Object.entries(type).map(([imgKey, image], index) => {
                        const imgName = `image_inputA${imgKey}Z`;
                        return (
                          <div key={imgKey} className="w-full md:w-[calc(33.33%-15px)] text-center">
                            <input type="hidden" name="has_image" value="1" />
                            <label htmlFor={`imgUpload${index}`}>
                              <img src={previews[imgName] || '/images/default.png'} alt="profile" className="w-full h-auto" />
                            </label>
                            <input type="file" name={imgName} id={`imgUpload${index}`} accept=".png, .jpg, .jpeg" onChange={(e) => handleFileChange(e, imgName, setPreviews, setValue, clearErrors)} className="hidden" />
                            {errors?.[imgName] && (
                              <Typography className="font-medium text-red-900" textGradient>
                                {errors?.[imgName].message}
                              </Typography>
                            )}
                            <label htmlFor={`imgUpload${index}`} className="mt-3 align-middle cursor-pointer select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-6 rounded-lg border hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] block w-full text-fore border-fore">
                              Upload {imgKey}
                            </label>
                          </div>
                        )
                      })}</div>);
                }

                if (k !== 'images' && k !== 'modal') {
                  if (type === 'icon') {
                    return (
                      <div className="w-full" key={index}>
                        <Select labelProps={{ className: cls[0] }} className={cls[1]} label={keyToTitle(k, true)} onChange={(val) => { setValue(k, val); clearErrors(k) }} value='' size="lg" menuProps={{ className: 'max-h-40 md:max-h-40 bg-header text-fore flex !flex-row flex-wrap gap-2' }}>
                          {Object.entries(social_icons).map(([sname, Sicon], skey) =>
                            <Option value={sname} key={skey} className="flex flex-col items-center gap-1">
                              <Sicon className="size-5" />
                              <p className="text-xs font-bold">{sname}</p>
                            </Option>
                          )}
                        </Select>
                        {errors[k] && <Typography color="red" className="mt-2 text-xs font-normal">
                          {errors[k].message}
                        </Typography>}
                      </div>
                    )
                  } else {
                    const Component = type === 'textarea' ? Textarea : Input;
                    return (
                      <div className="w-full" key={index}>
                        <Component {...register(k)} label={keyToTitle(k, true)} labelProps={{ className: cls[0] }} containerProps={{ className: 'min-w-0 w-full' }} className={cls[1]} error={errors[k]} />
                        {errors[k] && <Typography color="red" className="mt-2 text-xs font-normal">
                          {errors[k].message}
                        </Typography>}
                      </div>
                    )
                  }
                }
              })}
            </div>
            <div className="flex items-center justify-end mt-6 gap-3">
              <Button type="button" onClick={toggleHandler(handler)} color="red" size="sm" variant="outlined">
                Close
              </Button>
              <Button type="submit" size="sm" className="bg-primary disabled:!pointer-events-auto disabled:cursor-not-allowed justify-center" loading={loading}>
                Save
              </Button>
            </div>
          </form>
        </Card>) : (
          <Typography variant="h5">{DEFAULT_MESSAGES.INVALID_KEY}</Typography>
        )}
      </DialogBody>
    </Dialog>
  )
}

const EditModal = ({ open, handler, data }) => {
  const { section, key, record } = data || {};
  const schema = yup.object(validation(section?.element || {}));
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState({});
  const { register, handleSubmit, setValue, reset, clearErrors, formState: { errors }, } = useForm({
    resolver: yupResolver(schema),
  });

  // Reset form values whenever `data` changes
  useEffect(() => {
    if (data && record) {
      reset({ key: key, type: "element", id: record?.id, ...record?.data_values, });

      // Set initial image previews
      if (section?.element?.images) {
        Object.keys(section.element.images).forEach((imgKey) => {
          const firstKey = Object.keys(section.element.images)[0];
          setPreviews((prev) => ({
            ...prev, [`image_inputA${imgKey}Z`]: record?.data_values?.[firstKey],
          }));
        });
      }
    }
  }, [data, reset, section, record, key]);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await frontContent(formData);
      response.message ? toast.success(response.message) : toast.error(response.error);
      window.location.reload();
    } catch (error) {
      toast.error(`Submission failed. ${error}`);
    } finally {
      setLoading(false);
      handler();
    }
  };

  return (
    <Dialog open={open} handler={handler} size="md" className='bg-header'>
      <DialogBody className="text-fore">
        <XMarkIcon className="mr-3 h-5 w-5 absolute z-10 top-3 right-0" onClick={handler} />
        {key ? (<Card color="transparent" shadow={false} className='w-full text-fore'>
          <Typography variant="h5">Update {keyToTitle(key)} Item</Typography>
          <hr className="w-full my-3" />
          <form className="mb-2 mt-2 text-fore" onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" {...register('key')} defaultValue={key} />
            <input type="hidden" {...register('type')} defaultValue="element" />
            <input type="hidden" {...register('id')} defaultValue={record?.id} />
            <div className="mb-1 flex flex-col gap-6 px-2 pt-3 w-full max-h-[60vh] overflow-y-auto">
              {Object.entries(section.element).map(([k, type], index) => {
                if (k === 'images') {
                  return (
                    <div className="w-full flex gap-5 flex-wrap" key={index}>
                      {Object.entries(type).map(([imgKey, image], index) => {
                        let prevImg = ' ';
                        const firstKey = Object.keys(section.element.images)[0];
                        prevImg = record?.data_values?.[firstKey];
                        const imgName = `image_inputA${imgKey}Z`;
                        return (
                          <div key={imgKey} className="w-full md:w-[calc(33.33%-15px)] text-center">
                            <input type="hidden" name="has_image" value="1" />
                            <label htmlFor={`imgUpload${index}`}>
                              <img src={previews[imgName] || prevImg} alt="profile" className="w-full h-auto" />
                            </label>
                            <input type="file" name={imgName} id={`imgUpload${index}`} accept=".png, .jpg, .jpeg" onChange={(e) => handleFileChange(e, imgName, setPreviews, setValue, clearErrors)} className="hidden" />
                            {errors?.[imgName] && (
                              <Typography className="font-medium text-red-900" textGradient>
                                {errors?.[imgName].message}
                              </Typography>
                            )}
                            <label htmlFor={`imgUpload${index}`} className="mt-3 align-middle cursor-pointer select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-6 rounded-lg border hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] block w-full text-fore border-fore">
                              Upload {imgKey}
                            </label>
                          </div>
                        )
                      })}</div>);
                }
                if (k !== 'images' && k !== 'modal') {
                  if (type === 'icon') {
                    return (
                      <div className="w-full" key={index}>
                        <Select labelProps={{ className: cls[0] }} className={cls[1]} label={keyToTitle(k, true)} onChange={(val) => { setValue(k, val); clearErrors(k) }} value={record?.data_values?.[k]} size="lg" menuProps={{ className: 'max-h-40 md:max-h-40 bg-header text-fore flex !flex-row flex-wrap gap-2' }}>
                          {Object.entries(social_icons).map(([sname, Sicon], skey) =>
                            <Option value={sname} key={skey} className="flex flex-col items-center gap-1">
                              <Sicon className="size-5" />
                              <p className="text-xs font-bold">{sname}</p>
                            </Option>
                          )}
                        </Select>
                        {errors[k] && <Typography color="red" className="mt-2 text-xs font-normal">
                          {errors[k].message}
                        </Typography>}
                      </div>
                    )
                  } else {
                    const Component = type === 'textarea' ? Textarea : Input;
                    return (
                      <div className="w-full" key={index}>
                        <Component {...register(k)} defaultValue={record?.data_values?.[k]} label={keyToTitle(k, true)} labelProps={{ className: cls[0] }} containerProps={{ className: 'min-w-0 w-full' }} className={cls[1]} error={errors[k]} />
                        {errors[k] && <Typography color="red" className="mt-2 text-xs font-normal">
                          {errors[k].message}
                        </Typography>}
                      </div>
                    )
                  }
                }
              })}
            </div>
            <div className="flex items-center justify-end mt-6 gap-3">
              <Button type="button" onClick={toggleHandler(handler)} color="red" size="sm" variant="outlined">
                Close
              </Button>
              <Button type="submit" size="sm" className="bg-primary disabled:!pointer-events-auto disabled:cursor-not-allowed justify-center" loading={loading}>
                Update
              </Button>
            </div>
          </form>
        </Card>) : (
          <Typography variant="h5">{DEFAULT_MESSAGES.INVALID_KEY}</Typography>
        )}
      </DialogBody>
    </Dialog>
  )
}

const DeleteModal = ({ open, handler, data }) => {
  const { id } = data || {};

  const schema = yup.object({});
  const [loading, setLoading] = useState(false);

  const { register, reset, handleSubmit, formState: { errors }, } = useForm({ resolver: yupResolver(schema), });

  // Reset form values whenever `data` changes
  useEffect(() => {
    if (data && id) {
      reset({ id: id, });
    }
  }, [data, reset, id]);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await removeElement(formData);
      response.message ? toast.success(response.message) : toast.error(response.error);
      window.location.reload();
    } catch (error) {
      toast.error(`Deletion failed. ${error}`);
    } finally {
      setLoading(false);
      handler();
    }
  }

  return (
    <Dialog open={open} handler={handler} size="sm" className='bg-header'>
      <DialogBody className="grid place-items-center gap-4 md:p-16 relative text-fore" size="sm">
        <XMarkIcon className="mr-3 h-5 w-5 absolute z-10 top-3 right-0" onClick={handler} />
        {id ? (
          <Card color="transparent" shadow={false} className='w-full max-w-[500px] text-fore'>
            <Typography variant="h4">Confirmation</Typography>
            <Typography className="mt-1 font-normal">{DEFAULT_MESSAGES.CONFIRM_DELETE}</Typography>
            <form className="mb-2 mt-2 text-fore" onSubmit={handleSubmit(onSubmit)}>
              <input type="hidden" {...register('id')} defaultValue={id} />
              <div className="flex items-center justify-end mt-6 gap-3">
                <Button type="button" onClick={handler} color="red" size="sm" variant="outlined">
                  Close
                </Button>
                <Button type="submit" size="sm" className="bg-primary disabled:!pointer-events-auto disabled:cursor-not-allowed justify-center" loading={loading}>
                  Delete
                </Button>
              </div>
            </form>
          </Card>) : (
          <Typography variant="h5">{DEFAULT_MESSAGES.INVALID_ID}</Typography>
        )}
      </DialogBody>
    </Dialog>
  )
}

export function Elements({ datas }) {
  const { section, key, pageTitle, data } = datas || {};
  const schema = yup.object(validation(section?.element || {}));
  const [loading, setLoading] = useState(false);
  const [previews, setPreviews] = useState({});
  const { register, handleSubmit, setValue, reset, clearErrors, formState: { errors }, } = useForm({
    resolver: yupResolver(schema),
  });

  if (datas) {
    // Set initial image previews
    if (section?.element?.images) {
      Object.keys(section.element.images).forEach((imgKey) => {
        const firstKey = Object.keys(section.element.images)[0];
        data ?
          setPreviews((prev) => ({
            ...prev, [`image_inputA${imgKey}Z`]: data?.data_values?.[firstKey],
          })) :
          setPreviews((prev) => ({ ...prev, [`image_inputA${imgKey}Z`]: '/images/default.png', }));
      });
    }
  }

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await frontContent(formData);
      response.message ? toast.success(response.message) : toast.error(response.error);
    } catch (error) {
      toast.error(`Submission failed. ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTxt = (val, fieldName) => {
    setValue(fieldName, val);
    clearErrors(fieldName);
  }
  return (
    <React.Fragment>
      <div className="flex items-center justify-between">
        <Typography variant="h5" className="mb-4 text-fore">{pageTitle}</Typography>
        <Link to={`/admin/frontend/frontend-sections/${key}`}>
          <Button size="sm" variant="outlined" className="border-primary text-fore">
            Go Back
          </Button>
        </Link>
      </div>
      <BreadCrumbs separator="/" className='my-3 bg-header' links={[{ name: pageTitle, href: '' }]} />
      <Card className="bg-header text-fore">
        <CardBody>
          <form className="mb-2 mt-2 text-fore" onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" {...register('key')} defaultValue={key} />
            <input type="hidden" {...register('type')} defaultValue="element" />
            {data && <input type="hidden" {...register('id')} defaultValue={data?.id} />}
            <div className="mb-1 flex flex-col gap-6 px-2 py-3 w-full">
              {Object.entries(section.element).map(([k, type], index) => {
                if (k === 'images') {
                  return (
                    <div className="w-full flex gap-5 flex-wrap" key={index}>
                      {Object.entries(type).map(([imgKey, image], index) => {
                        let prevImg = ' ';
                        const firstKey = Object.keys(section.element.images)[0];
                        prevImg = record?.data_values?.[firstKey];
                        const imgName = `image_inputA${imgKey}Z`;
                        return (
                          <div key={imgKey} className="w-full md:w-[calc(33.33%-15px)] text-center">
                            <input type="hidden" name="has_image" value="1" />
                            <label htmlFor={`imgUpload${index}`}>
                              <img src={previews[imgName] || prevImg} alt="profile" className="w-full h-auto" />
                            </label>
                            <input type="file" name={imgName} id={`imgUpload${index}`} accept=".png, .jpg, .jpeg" onChange={(e) => handleFileChange(e, imgName, setPreviews, setValue, clearErrors)} className="hidden" />
                            {errors?.[imgName] && (
                              <Typography className="font-medium text-red-900" textGradient>
                                {errors?.[imgName].message}
                              </Typography>
                            )}
                            <label htmlFor={`imgUpload${index}`} className="mt-3 align-middle cursor-pointer select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-2 px-6 rounded-lg border hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] block w-full text-fore border-fore">
                              Upload {imgKey}
                            </label>
                          </div>
                        )
                      })}</div>);
                } else {
                  if (type === 'textarea') {
                    return (
                      <div className="w-full" key={index}>
                        <Textarea rows={10} {...register(k)} defaultValue={data?.data_values?.[k]} label={keyToTitle(k, true)} labelProps={{ className: cls[0] }} containerProps={{ className: 'min-w-0 w-full' }} className={cls[1]} error={errors[k]} />
                        {errors[k] && <Typography color="red" className="mt-2 text-xs font-normal">
                          {errors[k].message}
                        </Typography>}
                      </div>
                    )
                  } else if (type === 'nicedit') {
                    return (
                      <div className="w-full" key={index}>
                        <NicEdit className="w-full !text-fore p-5 border border-primary rounded-lg" defaultValue={data?.data_values?.[k]} {...register(k)} callback={(e) => handleEditTxt(e, k)} />
                        {errors[k] && <Typography color="red" className="mt-2 text-xs font-normal">
                          {errors[k].message}
                        </Typography>}
                      </div>
                    )
                  } else {
                    return (
                      <div className="w-full" key={index}>
                        <Input {...register(k)} defaultValue={data?.data_values?.[k]} label={keyToTitle(k, true)} labelProps={{ className: cls[0] }} containerProps={{ className: 'min-w-0 w-full' }} className={cls[1]} error={errors[k]} />
                        {errors[k] && <Typography color="red" className="mt-2 text-xs font-normal">
                          {errors[k].message}
                        </Typography>}
                      </div>
                    )
                  }
                }
              })}
            </div>
            <Button type="submit" className="mt-6 bg-primary disabled:!pointer-events-auto disabled:cursor-not-allowed justify-center" loading={loading} fullWidth>
              {data ? 'Update' : 'Create'}
            </Button>
          </form>
        </CardBody>
      </Card>
    </React.Fragment>
  );
}
