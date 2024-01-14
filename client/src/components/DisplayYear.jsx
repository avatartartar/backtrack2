import React, { useEffect, PureComponent } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const data = [
  {
    name: '2011',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: '2012',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: '2013',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: '2014',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: '2015',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: '2016',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: '2017',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: '2017',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: '2018',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: '2019',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: '2020',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: '2021',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: '2022',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
  {
    name: '2023',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];



const DisplayYear = () => {
  // Step 1
  // Here we can update the year variable when the user move the slider handle
  // const [year, setYear] = useState(null);
  const yearsArray = ['2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024']
   // Step 2

   // Fetch data depending on what we want to display in our graph
  
  
  useEffect(() => {
    var slider = document.getElementById("myRange");
    var output = document.getElementById("year");
    output.innerHTML = slider.value; // Display the default slider value

    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function () {
      output.innerHTML = this.value;
    }
  }, [])

  return (
    <div className="displayYearWrapper">
      <div className="slideContainer">
        <h1>The Year is</h1><h1 id="year"></h1>
        <input type="range" min={yearsArray[0]} max={yearsArray[yearsArray.length -1]} defaultValue={yearsArray[0]} className="slider" id="myRange"/>
      </div>

      <div className="chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default DisplayYear;