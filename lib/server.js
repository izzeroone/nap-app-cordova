// helper file

import axios from 'axios'

module.exports = {
    save: (data, title, description, cb) => {
        var dataForDatabase = {
            metaInfo: {
                title,
                description
            },
            chartData: {
                ...data
            }
        }
        console.log(data)
        axios.post('http://napchart.com/api/create', {
            data: JSON.stringify(dataForDatabase)
        })
            .then((response) => {
                console.log(response)
                var chartid = response.data.id

                cb(null, chartid)
            })
            .catch((hm) => {
                console.error('oh no!:', hm)
                cb('Oh no! There was an error with your request. Please try again')
            })
    },

    loadChart: (loading, loadFinish, cb) => {
        // first check if fetch is needed
        var chartid = window.chartid

        if (!chartid) {
            console.log('no chartid, nothing to load')
            return cb({})
        }

        loading()
        axios.get(`http://napchart.com/api/get?chartid=${chartid}`, )
            .then(response => {
                var data = {
                    ...response.data,
                    ...response.data.chartData,
                }
                delete data.chartData
                loadFinish()

                return cb(data)
            })
    },
}