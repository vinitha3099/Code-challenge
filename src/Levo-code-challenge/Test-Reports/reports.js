import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import './reports.css'
import axios from "axios";

function TestReports(props) {

    const { orgItem } = props
    const [testReports, setTestReports] = useState([])
    const [repoDetails, setRepoDetails] = useState(false)
    const [filter, setFilter] = useState('')
    const [testDetails, setTestDetails] = useState([])
    const [togglePass, setTogglePass] = useState(false)
    const [toggleFail, setToggleFail] = useState(false)
    const [failData, setFailData] = useState([])
    const [passData, setPassData] = useState([])


    useEffect(() => {
        // Fetching Data for test reports based on the organization id
        axios.get(`https://my.api.mockaroo.com/organizations/{${orgItem?.['id']}}}/reports.json?key=2e435a20`)
            .then((response) => {
                setTestReports(response.data)
            })
            .catch((err) => console.log(err))
    }, [])

    // Setting Pass and Fail Data 
    useEffect(() => {
        let failArr = []
        let passArr = []
        if (testDetails?.endpoints?.length > 0) {
            testDetails.endpoints?.forEach((i) => {
                if (i?.status == 'SUCCESS') {
                    passArr.push(i)
                }
                else {
                    failArr.push(i)
                }
            })
            setPassData(passArr)
            setFailData(failArr)
        }
    }, [testDetails?.endpoints])

    // Filtering Data based on the results in Filter by end point input
    const onChangeFilter = (e) => {
        setFilter(e.target.value)
        let failArr = []
        let passArr = []
        if (!!e.target.value && e.target.value.length > 0) {
            let searchData;
            if (isNaN(e.target.value)) {
                searchData = e.target.value.toLowerCase()
            }
            else {
                searchData = e.target.value
            }

            const filterData = testDetails.endpoints.filter(i => {
                return i?.url.includes(searchData)
            })
            filterData?.forEach((i) => {
                if (i?.status == 'SUCCESS') {
                    passArr.push(i)
                }
                else {
                    failArr.push(i)
                }
            })
            setPassData(passArr)
            setFailData(failArr)
        }
    }

    // onClick execution report
    const onClickExecNo = (id) => {
        setRepoDetails(true)

        // Fetching Data for test Details based on the test report id
        axios.get(`https://my.api.mockaroo.com/organizations/{${orgItem?.['id']}}}/reports/{${id?.['id']}}}/details.json?key=2e435a20`)
            .then((response) => {
                setTestDetails(response.data)
            })
            .catch((err) => console.log(err))
    }


    return (
        <Row style={{ display: 'flex' }}>

            {/* Organization Name */}
            <Col xs={3} sm={3} md={3} lg={3} className="report-org">
                <div className="organization-name">
                    <h1>Levo</h1>
                    <p>Organization Name {orgItem?.['name']}</p>
                </div>
                <p style={{color:'#bf07f2'}}>Test Reports</p>
            </Col>

            {/* Organization Test Reports */}
            {!repoDetails && <Col xs={9} sm={9} md={9} lg={9} className="details-content">
                <h2 style={{color:'blue'}}>Test Reports</h2>

                {/* Reports */}
                <div>
                    {testReports.map(report => (
                        <div className="report-container" onClick={() => { onClickExecNo(report) }}>
                            <Col xs={6}>
                                <span> Execution # {report.id}</span><br></br>
                                <span>{Math.floor(report.duration / 60000)} min ago</span>
                            </Col>
                            <Col xs={6}>
                                <span className="report-pass">{report.succeed_tests} passed </span>
                                <span className="report-fail">{report.failed_tests} failed</span>
                            </Col>

                        </div>
                    ))}
                </div>
            </Col>}

            {/* Organization Test Details */}
            {repoDetails && <Col xs={9} sm={9} md={9} lg={9} className="details-content">

                <div style={{ display: 'flex' }}>
                    <span>Test Reports</span>
                    <span style={{ paddingLeft: '16px' }}>{`> Execution # ${testDetails?.id}`}</span>
                </div>

                {/* Test Details Git Details */}
                <div className="test-details">
                    <img src={`/assets/icons/clock-solid.svg`} width='13' height='13' alt='dur-img' /><span>Duration: {Math.floor(testDetails?.duration / 60000)} m</span>
                    <img src={`/assets/icons/calendar-regular.svg`} width='13' height='13' style={{ paddingLeft: '16px' }} alt='time-img' /><span>Finished 10 minutes ago</span><br></br>
                    <img src={`/assets/icons/cube-solid.svg`} width='13' height='13' alt='cube-img' /><span>{testDetails?.job_name}</span><br></br>
                    <img src={`/assets/icons/arrow-right-solid.svg`} width='13' height='13' alt='arrow-img' /><span>{testDetails?.branch}</span>
                    <img src={`/assets/icons/code-commit-solid.svg`} width='13' height='13' style={{ paddingLeft: '10px' }} alt='commit-img' /><span>{testDetails?.commit}</span>
                    <img src={`/assets/icons/github.svg`} width='13' height='13' style={{ paddingLeft: '10px' }} alt='git-img' /><span>{testDetails?.github_user}</span><br></br>
                    <img src={`/assets/icons/globe-solid.svg`} width='13' hight='13' alt='url-img' /><span>{testDetails?.environment_url}</span>
                </div>

                {/* Results Screen */}
                <div className="test-results">
                    <h2  style={{color:'blue'}}>Results</h2>
                    <hr></hr>

                    {/* Filtering Input */}
                    <input value={filter} onChange={onChangeFilter} placeholder="Filter by end point..." style={{ width: '97%', marginBottom: '3%' }} />

                    {/* Failed Results */}
                    <div style={{ display: 'flex' }}>
                        {toggleFail ? <img src={`/assets/icons/chevron-down-solid.svg`} width='15' height='15' alt='fail-img' onClick={() => { setToggleFail(false) }} /> :
                            <img src={`/assets/icons/chevron-up-solid.svg`} width='15' height='15' alt='fail-img' onClick={() => { setToggleFail(true) }} />}
                        <img src={`/assets/icons/circle-xmark-regular.svg`} width='20' height='20' alt='fail-img' style={{ marginLeft: '20px' }} />
                        <span style={{ marginLeft: '20px' }}>Failed Tests ({failData?.length}/{testDetails?.endpoints?.length})</span>
                    </div>
                    {toggleFail && failData?.length > 0 &&
                        failData?.map((item) => {
                            return <div className="details-fail-container">
                                <Col xs={6} className="details-items">
                                    <span>{item?.url} </span>
                                    <span>{item?.duration}s</span>
                                </Col>
                            </div>
                        })}

                    {/* Passed Results */}
                    <div style={{ display: 'flex', marginTop: '4%' }}>
                        {togglePass ? <img src={`/assets/icons/chevron-down-solid.svg`} width='15' height='15' alt='fail-img' onClick={() => { setTogglePass(false) }} /> :
                            <img src={`/assets/icons/chevron-up-solid.svg`} width='15' height='15' alt='fail-img' onClick={() => { setTogglePass(true) }} />}
                        <img src={`/assets/icons/circle-check-solid.svg`} alt='pass-img' width='20' height='20' style={{ marginLeft: '20px' }} />
                        <span style={{ marginLeft: '20px' }}>Passed Tests ({passData?.length}/{testDetails?.endpoints?.length})</span>
                    </div>
                    {togglePass && passData?.length > 0 &&
                        passData?.map((item) => {
                            return <div className="details-pass-container">
                                <Col xs={6} className="details-items">
                                    <span>{item?.url} </span>
                                    <span>{item?.duration}s</span>
                                </Col>
                            </div>
                        })}
                </div>
            </Col>}
        </Row>
    )

}

export default TestReports;