import { useEffect, useState } from "react";
import axios from "axios";
import { Col, Row } from "react-bootstrap";
import './organization.css';
import TestReports from "../Test-Reports/reports";

function Organization() {
    const [orgData, setOrData] = useState([])
    const [orgItem, setOrgItem] = useState([])
    const [testRepo, setTestRepo] = useState(false)

    useEffect(() => {
        // Fetching Organization Data 
        axios.get('https://my.api.mockaroo.com/organizations.json?key=2e435a20')
            .then((response) => {
                setOrData(response.data)
            })
    }, [])


    // On click Organization name
    const onClickOrg = (data) => {
        setOrgItem(data)
        setTestRepo(true)
    }

    return (
        <div>
            {!testRepo &&
                <>
                    <h1 style={{ display: 'flex' }}>Levo</h1>

                    {/* ORGANIZATION SCREEN */}
                    <Row>
                        <h1 style={{color:'#bf42f5'}}>Organizations</h1>
                        <p style={{color:'#bf07f2'}}>Pick the organization you want to access to</p>

                        {orgData?.length > 0 && orgData.map(item => {
                            return <Col className="org-container" onClick={() => onClickOrg(item)}>
                                <img src={`/assets/icons/building-regular.svg`} width='13' height='13' alt='org-img' />
                                <span>Organization Name {item?.['name']}</span>
                            </Col>
                        })}
                    </Row>
                </>}

            {/* TEST REPORTS */}
            {testRepo && <TestReports orgItem={orgItem} setTestRepo={setTestRepo} />}
        </div>
    )
}

export default Organization;