import { AccordionDetails, accordionDetailsClasses, AccordionSummary, Alert, Button, Container, Fade, FormControl, Grid2, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Tooltip, Typography } from "@mui/material"
import { useState } from "react"
import Accordion, {
  AccordionSlots,
  accordionClasses,
} from '@mui/material/Accordion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { useQuery } from "@tanstack/react-query";
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import { DateTime } from "luxon";
import Navbar from "../components/Navbar";
import api from "../utils/axios";

const Home = () =>{
  const [exportError, setExportError] = useState<boolean>(false);
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState(100)
  const [expanded, setExpanded] = useState<boolean>(true);
  const [productName, setProductName] = useState<string>("")
  const [term, setTerm] = useState<string>("")
  const [status, setStatus] = useState<string>("")
  const [gender, setGender] = useState<string>("")
  const [createdBy, setCreatedBy] = useState<string>("")
  const [occupation, setOccupation] = useState<string>("")
  const [from, setFrom] = useState<DateTime | null>(null)
  const [to, setTo] = useState<DateTime | null>(null)
  const [pageToken, setPageToken] = useState<string>("")
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [previousToken, setPreviousToken] = useState<string[]>([])

  const statementsQuery = useQuery({
    queryKey: ["statements", pageToken, pageSize, from, to, productName, term, status, gender, createdBy, occupation],
    queryFn: async() => {
      const apiURL = new URL(`${import.meta.env.VITE_API_BASE_URL}/v1/statements`)
      apiURL.searchParams.set("pageSize", pageSize.toString())
      if (productName){
        const product = productName === "All" ? "" : productName
        apiURL.searchParams.set("productName", product)
      }
      if (term){
        const t = term === "All" ? "" : term
        apiURL.searchParams.set("term", t)
      }
      if (status){
        const s = status === "All" ? "" : status
        apiURL.searchParams.set("status", s)
      }
      if(gender){
        const g = gender === "All" ? "" : gender
        apiURL.searchParams.set("gender", g)
      }
      if (occupation){
        const o = occupation === "All" ? "" : occupation
        apiURL.searchParams.set("occupation", o)
      }
      apiURL.searchParams.set("createdBy", createdBy)
      if (from) {
        apiURL.searchParams.set("createdAfter", from.toString())
      }
      if (to) {
        const toDate = to.plus({ hours: 23, minutes: 59, seconds: 59 })
        apiURL.searchParams.set("createdBefore", toDate.toString())
      }
      if (pageToken) {
        apiURL.searchParams.set("pageToken", pageToken)
      }

      const resp = await api.get(apiURL.toString())
      if (resp.status !== 200) {
        throw new Error(resp.statusText)
      }
      return resp.data
    },
    refetchOnWindowFocus: false,
  })

  const productNamesQuery= useQuery({
    queryKey: ["productsName"],
    queryFn: async() => {
      const resp =await api.get("/v1/product-names")
      if (resp.status !== 200) {
        throw new Error(resp.statusText)
      }
      return resp.data
    },
    refetchOnWindowFocus: false,
  })

  const termsQuery = useQuery({
    queryKey: ["terms"],
    queryFn: async()=> {
      const resp = await api.get("/v1/terms")
      if (resp.status !== 200) {
        throw new Error(resp.statusText)
      }
      return resp.data
    },
    refetchOnWindowFocus: false,
  })

  const occupationsQuery = useQuery({
    queryKey: ["occupations"],
    queryFn: async()=> {
      const resp = await api.get("/v1/occupations")
      if (resp.status !== 200) {
        throw new Error(resp.statusText)
      }
      return resp.data
    },
    refetchOnWindowFocus: false,
  })

  const indexOfLastItem = (pageNumber+1) * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value))
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  }

  const handleProductNameChange = (event: SelectChangeEvent) => {
    setProductName(event.target.value)
  }

  const handleTermChange = (event: SelectChangeEvent) => {
    setTerm(event.target.value)
  }

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value)
  }

  const handleGenderChange = (event: SelectChangeEvent) => {
    setGender(event.target.value)
  }

  const handleCreatedByChange = (event: React.ChangeEvent<HTMLInputElement> ) => {
    setCreatedBy(event.target.value)
  }

  const handleOccupationChange = (event: SelectChangeEvent) => {
    setOccupation(event.target.value)
  }

  const handleFromChange = (newValue: DateTime | null) => {
    setFrom(newValue)
  }

  const handleToChange = (newValue: DateTime | null) => {
    setTo(newValue)
  }

  const handPreviousToken = (token: string) => {
    setPreviousToken((t) => [...t, token]);
  };

  const getPreviousToken = (): string => {
    const token = previousToken[previousToken.length - 1];
    setPreviousToken((t) => t.slice(0, t.length - 1));
    return token
  };

  const handleExportToExcel = async() => {
    setExportLoading(true)
    const apiURL = new URL(`${import.meta.env.VITE_API_BASE_URL}/v1/statements/export-to-excel`)
      if (productName){
        const product = productName === "All" ? "" : productName
        apiURL.searchParams.set("productName", product)
      }
      if (term){
        const t = term === "All" ? "" : term
        apiURL.searchParams.set("term", t)
      }
      if (status){
        const s = status === "All" ? "" : status
        apiURL.searchParams.set("status", s)
      }
      if(gender){
        const g = gender === "All" ? "" : gender
        apiURL.searchParams.set("gender", g)
      }
      if (occupation){
        const o = occupation === "All" ? "" : occupation
        apiURL.searchParams.set("occupation", o)
      }
      apiURL.searchParams.set("createdBy", createdBy)
      if (from) {
        apiURL.searchParams.set("createdAfter", from.toString())
      }
      if (to) {
        const toDate = to.plus({ hours: 23, minutes: 59, seconds: 59 })
        apiURL.searchParams.set("createdBefore", toDate.toString())
      }

      try {
        const resp = await api.get(apiURL.toString(), {responseType: "blob"})
        if (resp.status !== 200) {
          throw new Error(resp.statusText)
        }

        const blob = resp.data;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "statement-report.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setExportError(false)
        setExportLoading(false)
        return
      } catch (error) {
        setExportError(true)
        setExportLoading(false)
        return
      }
  }

  const resetFilters =() => {
    setProductName("")
    setTerm("")
    setStatus("")
    setCreatedBy("")
    setFrom(null)
    setTo(null)
    setOccupation("")
    setGender("")
    setPageToken("")
    setPreviousToken([])
    setExportError(false)
    setPageNumber(0)
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{mt: 2}}>
        <div>
        <Typography variant="h5" sx={{mt: 3, mb: 1}}>List of requests for E-statement</Typography>
        <Accordion
            expanded={expanded}
            onChange={handleExpandClick}
            slots={{ transition: Fade as AccordionSlots['transition'] }}
            slotProps={{ transition: { timeout: 400 } }}
            sx={[
              expanded
                ? {
                    [`& .${accordionClasses.region}`]: {
                      height: 'auto',
                    },
                    [`& .${accordionDetailsClasses.root}`]: {
                      display: 'block',
                    },
                  }
                : {
                    [`& .${accordionClasses.region}`]: {
                      height: 0,
                    },
                    [`& .${accordionDetailsClasses.root}`]: {
                      display: 'none',
                    },
                  },
            ]}
          >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
            sx={{p: 2}}
          >
            <Typography variant="h6" component="span">Filters</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Grid2 
              container 
              spacing={2} 
              sx={{mb: 2}} 
              display='flex'
            >
              <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 3}}>
                <LocalizationProvider dateAdapter={AdapterLuxon}>
                  <DatePicker 
                    format="dd/MM/yyyy"
                    value={from} 
                    onChange={(date) => handleFromChange(date)} 
                    label="From"
                    slotProps={{
                      textField:{
                        name: "from",
                        id: "from",
                        fullWidth: true,
                        size: "medium"
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 3}}>
                <LocalizationProvider dateAdapter={AdapterLuxon}>
                  <DatePicker 
                    format="dd/MM/yyyy"
                    value={to} 
                    onChange={(date) => handleToChange(date)} 
                    label="To"
                    slotProps={{
                      textField:{
                        name: "to",
                        id: "to",
                        fullWidth: true,
                        size: "medium"
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 3}} alignContent='center'>
                <FormControl size="medium" fullWidth variant="outlined">
                  <InputLabel id="product_name_label">Product</InputLabel>
                  <Select 
                  name="productName"
                  id="product_name"
                  value={productName}
                  labelId="product_name_label"
                  label="Product"
                  onChange={handleProductNameChange}
                  >
                    <MenuItem value="All">All</MenuItem>
                    {
                      productNamesQuery.data && 
                      !productNamesQuery.isLoading &&
                      !productNamesQuery.isError && 
                      productNamesQuery
                      .data
                      .productNames.map((i : string)=> {
                        return <MenuItem key={i} value={i}>{i}</MenuItem>
                      })
                    }
                  </Select>
                </FormControl>
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 3}} alignContent='center'>
                <FormControl size="medium" fullWidth variant="outlined">
                  <InputLabel id="term_label">Term</InputLabel>
                  <Select 
                    name="term"
                    id="term"
                    value={term}
                    labelId="term_label"
                    label="Term"
                    onChange={handleTermChange}
                  >
                    <MenuItem value="All">All</MenuItem>
                    {
                      termsQuery.data && 
                      !termsQuery.isLoading && 
                      !termsQuery.isError && 
                      termsQuery 
                      .data
                      .terms.map((t : string)=> {
                        return <MenuItem key={t} value={t}>{t} Months</MenuItem>
                      })
                    }
                  </Select>
                </FormControl>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 3}} alignContent='center'>
                <FormControl size="medium" fullWidth variant="outlined">
                  <InputLabel id="occupation_label">Occupation</InputLabel>
                  <Select 
                    name="occupation"
                    id="occupation"
                    value={occupation}
                    labelId="occupation_label"
                    label="occupation"
                    onChange={handleOccupationChange}
                  >
                    <MenuItem value="All">All</MenuItem>
                    {
                      occupationsQuery.data &&
                      !occupationsQuery.isLoading &&
                      !occupationsQuery.isError && 
                      occupationsQuery 
                      .data 
                      .occupations.map((o : string)=> {
                        return <MenuItem key={o} value={o}>
                            <Typography
                              sx={{
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                display: 'block',
                                fontSize: 'inherit',
                                fontFamily: 'Noto Sans Lao'
                              }}
                            >
                              {o}
                            </Typography>
                          </MenuItem>
                      })
                    }
                  </Select>
                </FormControl>
              </Grid2>

              <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 3}} alignContent='center'>
                <FormControl size="medium" fullWidth variant="outlined">
                  <InputLabel id="gender_label">Gender</InputLabel>
                  <Select 
                    name="gender"
                    id="gender"
                    value={gender}
                    labelId="gender_label"
                    label="Gender"
                    onChange={handleGenderChange}
                  >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="ທ້າວ">Male</MenuItem>
                    <MenuItem value="ນາງ">Female</MenuItem>
                  </Select>
                </FormControl>
              </Grid2>
              
              <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 3}} alignContent='center'>
                <FormControl size="medium" fullWidth variant="outlined">
                  <InputLabel id="status_label">Status</InputLabel>
                  <Select 
                    name="status"
                    id="status"
                    value={status}
                    labelId="status_label"
                    label="Status"
                    onChange={handleStatusChange}
                  >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="N/A">Pending</MenuItem>
                    <MenuItem value="Success">Success</MenuItem>
                    <MenuItem value="REJECT">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Grid2>
              
              <Grid2 size={{ xs: 12, sm: 6, md: 3, lg: 3}} alignContent='center'>
                <TextField 
                  id="createdBy"
                  name="createdBy"
                  label="Created By" 
                  variant="outlined" 
                  fullWidth 
                  size="medium"
                  value={createdBy}
                  onChange={handleCreatedByChange}
                />
              </Grid2>
              
            </Grid2>

            {exportError && 
            <Alert severity="error" sx={{ mb: 1, mt: 1}}>[Export to excel] Something went wrong. Please try again later or contact the admin</Alert>}

            <Grid2 
              container 
              spacing={2} 
              sx={{mb: 0}}
              alignContent="center"
              justifyContent="center"
            >
              <Grid2 alignItems="center">
                <Button
                  loading={exportLoading}
                  loadingPosition="start"
                  variant="outlined"
                  onClick={handleExportToExcel}
                >Export To Excel</Button>
              </Grid2>
              <Grid2 alignItems="center">
                <Button 
                  variant="contained"
                  onClick={resetFilters}
                >Reset</Button>
              </Grid2>
            </Grid2>
          </AccordionDetails>
        </Accordion>

        <TableContainer component={Paper} sx={{ mb: 1}}>
          <Table size="small" aria-label="E-statement Requests">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>No.</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Number</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Gender</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Occupation</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Account</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Term</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Bank</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Remark</TableCell>
                <TableCell 
                  sx={{ 
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      display: 'block',
                      alignContent: 'center',
                      fontWeight: 'bold'
                    }}
                >SendMail</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>MailMessage</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>CreatedBy</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Bank CreatedAt</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>CreatedAt</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {
                statementsQuery.isLoading && 
                <TableRow>
                  <TableCell colSpan={16}>
                    <Skeleton />
                    <Skeleton animation="wave" />
                    <Skeleton animation={false} />
                  </TableCell>
                </TableRow>
              }
              {
                statementsQuery.isError && 
                <TableRow>
                  <TableCell colSpan={16}>
                    <Alert severity="error">Something went wrong. Please try again later or contact the admin</Alert>
                  </TableCell>
                </TableRow>
              } */}

              {
                statementsQuery.isLoading && 
                <TableRow>
                  <TableCell colSpan={16}>
                    <Skeleton />
                    <Skeleton animation="wave" />
                    <Skeleton animation={false} />
                  </TableCell>
                </TableRow>
              }

              {
                !statementsQuery.isLoading &&
                statementsQuery.data && 
                !statementsQuery.isError && 
                statementsQuery 
                .data
                .statements.map((s : StatementRequested, index: number)=> {
                  return <TableRow 
                    key={s.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>{index+1 +indexOfFirstItem}</TableCell>
                    <TableCell>{s.queueNumber}</TableCell>
                    <TableCell>{s.customer.gender === "ທ້າວ" ? "Male" : "Female"}</TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          display: 'block',
                          fontSize: 'inherit',
                          fontFamily: 'Noto Sans Lao'
                        }}
                      >
                        {s.customer.displayName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          display: 'block',
                          fontSize: 'inherit',
                          fontFamily: 'Noto Sans Lao'
                        }}
                      >
                        {s.customer.occupation}
                      </Typography>  
                    </TableCell>
                    <TableCell>{s.productName}</TableCell>
                    <TableCell>{s.bankAccount.number}</TableCell>
                    <TableCell>{s.bankAccount.term}</TableCell>
                    <TableCell>{s.bankAccount.code}</TableCell>
                    <TableCell>{s.status}</TableCell>
                    <TableCell>
                      <Tooltip title={s.bankAccount.info}>
                        <Typography 
                          sx={{
                            maxWidth: 250,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: 'block',
                            fontSize: 'inherit'
                          }}  
                        >
                          {s.bankAccount.info}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{textAlign : 'center'}}>{s.email.isSent ? <MarkEmailReadOutlinedIcon color="inherit" /> : ''}</TableCell>
                    <TableCell>
                      <Tooltip title={s.email.message}>
                        <Typography 
                          sx={{
                            maxWidth: 250,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: 'block',
                            fontSize: 'inherit'
                          }}  
                        >
                          {s.email.message}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{s.createdBy}</TableCell>
                    <TableCell>
                      <Typography 
                        sx={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: 'block',
                          fontSize: 'inherit'
                        }}  
                      >
                      {s.bankAccount.createdAt ? DateTime.fromISO(s.bankAccount.createdAt,{zone: 'UTC'}).toFormat('dd/MM/yyyy HH:mm:ss') : ''}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        sx={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: 'block',
                          fontSize: 'inherit'
                        }}  
                      >
                      {DateTime.fromISO(s.createdAt, {zone: 'UTC'}).toFormat('dd/MM/yyyy HH:mm:ss')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                })
              }
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          rowsPerPage={pageSize}
          page={pageNumber}
          count={statementsQuery.data ? statementsQuery.data.statements.length : 0}
          onPageChange={() => {}}
          onRowsPerPageChange={handlePageSizeChange}
          labelRowsPerPage="Page Size"
          labelDisplayedRows={() => ``}
          rowsPerPageOptions={[100, 200]}
          slotProps={{
            actions:{
              previousButton: {
                disabled: previousToken.length >= 1 ? false : true,
                onClick: () => {
                  if (pageNumber > 0 && previousToken.length > 0) {
                    setPageNumber(pageNumber - 1)
                    if (previousToken.length == 1){
                      setPreviousToken([])
                      setPageToken("")
                      return
                    }

                    const token = getPreviousToken()
                    setPageToken(token)
                  }
                }
              },
              nextButton:{
                disabled: statementsQuery.data && statementsQuery.data.nextPageToken.length > 0 ? false : true,
                onClick: () => {
                  if (statementsQuery.data && statementsQuery.data.nextPageToken.length > 0){
                    const token =statementsQuery.data.nextPageToken
                    setPageNumber(pageNumber + 1)
                    setPageToken(token)
                    handPreviousToken(token)
                  }
                }
              }
            }
          }}
        />
        </div>
      </Container>
    </>
  )
} 

 interface StatementRequested {
  id: string
  queueNumber: string
  productName: string
  customer: Customer
  bankAccount: BankAccount
  email: Email
  status: string
  createdBy: string
  createdAt: string
}

 interface Customer {
  gender: string
  displayName: string
  occupation: string
}

 interface BankAccount {
  number: string
  term: string
  code: string
  status: string
  info: string
  createdAt: string | null
}

 interface Email {
  isSent: boolean
  message: string
}

export default Home