import React, { useEffect, useState } from 'react'
import styles from './common1.module.css'
import { backendurls } from '../../../../../api/backendEndpoints'
import { authentcatedApiClient } from '../../../../../api/axiosconfig'
import '../../../../../assets/css/sweetalert-custom.css'

function LocationLookup({ userid, subscribed }) {
  const [details, setDetails] = useState({})

  // fetching data from the backen
  useEffect(() => {
    const fetchLocaitionDetails = async () => {
      try {
        const response = await authentcatedApiClient.get(
          backendurls.userprofile,
          {
            headers: {
              lookupuserid: userid,
              details: 'location_details',
              type: 'lookup',
            },
          },
        )

        if (response.data.message === 'success') {
          setDetails(response.data.location_details)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchLocaitionDetails()
  }, [])

  return (
    <div className={styles.outerwrapper}>
      <h4 className={styles.heading}>location detais</h4>
      <div>
        <div className={`container-fluid ${styles.basic_details}`}>
          <div className="row">
            <div className="col-lg-6 col-12 p-0">
              <table className={` ${styles.tableBackgroundAlternate}`}>
                <tbody>
                  <tr className={styles.rows}>
                    <td className={styles.items}>State</td>
                    <td className={styles.info}>
                      {!details.state ? 'Not specified' : details.state}
                    </td>
                  </tr>
                  <tr className={styles.rows}>
                    <td className={styles.items}>District</td>
                    <td
                      className={
                        subscribed ? `${styles.info}` : `${styles.blurringinfo}`
                      }
                    >
                      {!details.district ? 'Not specified' : details.district}
                    </td>
                  </tr>
                  <tr className={styles.rows}>
                    <td className={styles.items}>Ancesters origin</td>
                    <td
                      className={
                        subscribed ? `${styles.info}` : `${styles.blurringinfo}`
                      }
                    >
                      {!details.ancesters_origin
                        ? 'Not specified'
                        : details.ancesters_origin}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-lg-6 col-12 p-0">
              <table className={` ${styles.tableBackgroundAlternate}`}>
                <tbody>
                  <tr className={styles.rows}>
                    <td className={styles.items}>City</td>
                    <td
                      className={
                        subscribed ? `${styles.info}` : `${styles.blurringinfo}`
                      }
                    >
                      {!details.city ? 'Not specified' : details.city}
                    </td>
                  </tr>
                  <tr className={styles.rows}>
                    <td className={styles.items}>Working in</td>
                    <td
                      className={
                        subscribed ? `${styles.info}` : `${styles.blurringinfo}`
                      }
                    >
                      {!details.work_place
                        ? 'Not specified'
                        : details.work_place}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LocationLookup
