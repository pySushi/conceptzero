'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { PieChart, Pie, Cell } from 'recharts'
import { LineChart, Line } from 'recharts'
import { Table } from "@/components/ui/table"

type DataItem = {
  Title: string
  Subtitle: string
  sub_object_type1: 'bar_chart' | 'line_chart' | 'pie_chart' | 'table'
  sub_object_data1: Array<Array<string | number>>
  sub_object_type2: 'table' | 'bullet_points'
  sub_object_data2: Array<Array<string | number>> | string[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

const BarChartComponent: React.FC<{ data: Array<Array<string | number>> }> = ({ data }) => {
  const seriesNames = data[0].slice(1) as string[];
  const chartData = data.slice(1).map((row) => {
    const [name, ...values] = row;
    const dataPoint: { [key: string]: string | number } = { name };
    seriesNames.forEach((seriesName, index) => {
      dataPoint[seriesName] = values[index];
    });
    return dataPoint;
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {seriesNames.map((seriesName, index) => (
          <Bar
            key={seriesName}
            dataKey={seriesName}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

const LineChartComponent: React.FC<{ data: Array<Array<string | number>> }> = ({ data }) => {
  const seriesNames = data[0].slice(1) as string[];
  const chartData = data.slice(1).map((row) => {
    const [name, ...values] = row;
    const dataPoint: { [key: string]: string | number } = { name };
    seriesNames.forEach((seriesName, index) => {
      dataPoint[seriesName] = values[index];
    });
    return dataPoint;
  });


  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {seriesNames.map((seriesName, index) => (
          <Line
            key={seriesName}
            type="monotone"
            dataKey={seriesName}
            stroke={COLORS[index % COLORS.length]}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${name} ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
const PieChartComponent: React.FC<{ data: Array<Array<string | number>> }> = ({ data }) => {
  const seriesNames = data[0].slice(1) as string[];
  const chartData = data.slice(1).map((row) => {
    const [name, ...values] = row;
    return { 
      name, 
      value: values.reduce((sum, val) => sum + (typeof val === 'number' ? val : 0), 0)
    };
  });

  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={CustomLabel}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => [`${value} (${((value / totalValue) * 100).toFixed(2)}%)`, 'Value']}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

const TableComponent: React.FC<{ data: Array<Array<string | number>> }> = ({ data }) => {
  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {data[0].map((header, index) => (
              <th key={index} scope="col" className="px-6 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(1).map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              className={`${rowIndex % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'} border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600`}
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4 whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const BulletPoints: React.FC<{ data: string[] }> = ({ data }) => {
  return (
    <ul className="list-disc pl-5 space-y-2">
      {data.map((point, index) => (
        <li key={index}>{point}</li>
      ))}
    </ul>
  )
}

const DynamicCard: React.FC<{ data: DataItem }> = ({ data }) => {
  const renderSubObject1 = () => {
    const titleElement = <h3 className="text-lg font-semibold">{data.sub_object_type1_title}</h3>;
    
    switch (data.sub_object_type1) {
      case 'bar_chart':
        return (
          <>
            {titleElement}
            <BarChartComponent data={data.sub_object_data1} />
          </>
        );
      case 'line_chart':
        return (
          <>
            {titleElement}
            <LineChartComponent data={data.sub_object_data1} />
          </>
        );
      case 'pie_chart':
        return (
          <>
            {titleElement}
            <PieChartComponent data={data.sub_object_data1} />
          </>
        );
      case 'table':
        return (
          <>
            {titleElement}
            <TableComponent data={data.sub_object_data1} />
          </>
        );
      default:
        return null;
    }
  };

  const renderSubObject2 = () => {
    const titleElement = <h3 className="text-lg font-semibold">{data.sub_object_type2_title}</h3>;
  
    switch (data.sub_object_type2) {
      case 'table':
        return (
          <>
            {titleElement}
            <TableComponent data={data.sub_object_data2 as Array<Array<string | number>>} />
          </>
        );
      case 'bullet_points':
        return (
          <>
            {titleElement}
            <BulletPoints data={data.sub_object_data2 as string[]} />
          </>
        );
      default:
        return null;
    }
  };
  
  const renderSubObject3 = () => {
    const titleElement = <h3 className="text-lg font-semibold">{data.sub_object_type3_title}</h3>;
  
    switch (data.sub_object_type3) {
      case 'bullet_points':
        return (
          <>
            {titleElement}
            <BulletPoints data={data.sub_object_data3 as string[]} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-9xl mx-auto relative">
      <div className="absolute top-4 left-0 bg-blue-500 text-white px-4 py-1 text-sm font-semibold shadow-md">
        Database: {data.Database}
      </div>
      <CardHeader className="pt-12">
        <h2 className="text-xl font-semibold">{data.Title}</h2>
        <p className="text-sm text-muted-foreground">Query Parameter: {JSON.stringify(data.Query, null, 2)}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            {renderSubObject1()}
          </div>
          <div className="space-y-4">
            {renderSubObject2()}
          </div>
          <div className="space-y-4">
            {renderSubObject3()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Component() {
  const jsonData: DataItem[] = [
    {
      "Title": "Comparison of AI Strategy between Infosys and Wipro",
      "Database": "Company Filings",
      "Query": {
        "Company": ["Infosys", "Wipro"],
        "Topic": "Artificial Intelligence OR AI",
        "Timeline": "3–5 years"
      },
      "sub_object_type1": "bar_chart",
      "sub_object_type1_title": "Mentions of 'Artificial Intelligence' or 'AI' in Filings Over Time",
      "sub_object_data1": [
        [
          "Year",
          "Infosys Mentions",
          "Wipro Mentions"
        ],
        [
          2019,
          50,
          40
        ],
        [
          2020,
          65,
          55
        ],
        [
          2021,
          80,
          70
        ],
        [
          2022,
          95,
          85
        ],
        [
          2023,
          120,
          110
        ]
      ],
      "sub_object_type2": "table",
      "sub_object_type2_title": "Top Related Keywords in AI Strategy for Infosys and Wipro",
      "sub_object_data2": [
        [
          "Company",
          "Top Keyword",
          "Frequency"
        ],
        [
          "Infosys",
          "AI-driven Automation",
          35
        ],
        [
          "Infosys",
          "Machine Learning",
          28
        ],
        [
          "Wipro",
          "AI for Cybersecurity",
          40
        ],
        [
          "Wipro",
          "AI in Cloud Computing",
          30
        ]
      ],
      "sub_object_type3": "bullet_points",
      "sub_object_type3_title": "Summary of AI Strategy in Filings",
      "sub_object_data3": [
        "Infosys is focusing heavily on AI-driven automation and machine learning to enhance their service delivery models.",
        "Wipro places a strong emphasis on AI applications in cybersecurity and cloud computing as part of their innovation strategy.",
        "Both companies have increased mentions of AI steadily over the last 5 years, reflecting growing focus on AI investments."
      ]
    },
  
    {
      "Title": "Comparison of AI-Related Patents between Infosys and Wipro",
      "Database": "Patents",
      "Query": {
        "Company": ["Infosys", "Wipro"],
        "Topic": "Artificial Intelligence OR AI",
        "Timeline": "3-5 years"
      },
      "sub_object_type1": "line_chart",
      "sub_object_type1_title": "AI-Related Patent Filing Trend Over Time (2019-2023)",
      "sub_object_data1": [
        ["Year", "Infosys Patents", "Wipro Patents"],
        [2019, 25, 15],
        [2020, 30, 20],
        [2021, 40, 35],
        [2022, 50, 45],
        [2023, 55, 40]
      ],
      "sub_object_type2": "table",
      "sub_object_type2_title": "Top AI Technologies Patented by Infosys and Wipro",
      "sub_object_data2": [
        ["Company", "Top Technology", "Patent Count"],
        ["Infosys", "Natural Language Processing (NLP)", 15],
        ["Infosys", "AI for Cybersecurity", 10],
        ["Wipro", "AI-Driven Automation", 12],
        ["Wipro", "Machine Learning Models", 8]
      ],
      "sub_object_type3": "bullet_points",
      "sub_object_type3_title": "Summary of AI Patents",
      "sub_object_data3": [
        "Infosys has a growing focus on NLP and AI-driven cybersecurity patents.",
        "Wipro’s patent strategy leans toward AI-driven automation and machine learning models.",
        "Both companies show an upward trend in AI patent filings over the past 5 years.",
        "Infosys filed more AI-related patents than Wipro in 2023, indicating higher R&D focus."
      ]
    },
    {
      "Title": "AI-Related Deals of Infosys and Wipro: A Comparative Analysis",
      "Database": "Deals",
      "Query": {
        "Company": ["Infosys", "Wipro"],
        "Topic": ["Artificial Intelligence", "AI"],
        "Timeline": "3–5 years",
        "Deal Type": ["Acquisitions", "Investments", "Partnerships"]
      },
      "sub_object_type1": "bar_chart",
      "sub_object_type1_title": "Comparison of AI-Related Deals Between Infosys and Wipro Over the Past 5 Years",
      "sub_object_data1": [
        [
          "Year",
          "Infosys Deals",
          "Wipro Deals"
        ],
        [
          2019,
          5,
          3
        ],
        [
          2020,
          7,
          4
        ],
        [
          2021,
          10,
          6
        ],
        [
          2022,
          8,
          9
        ],
        [
          2023,
          12,
          7
        ]
      ],
      "sub_object_type2": "table",
      "sub_object_type2_title": "Major AI-Related Deals by Infosys and Wipro",
      "sub_object_data2": [
        [
          "Company",
          "Deal Type",
          "Partner/Acquired Company",
          "Deal Description",
          "Year"
        ],
        [
          "Infosys",
          "Acquisition",
          "AI Startup X",
          "Acquired AI startup focusing on AI-driven automation for cloud infrastructure",
          "2021"
        ],
        [
          "Wipro",
          "Partnership",
          "AI Innovators",
          "Partnership with AI Innovators to develop AI-based cybersecurity solutions",
          "2022"
        ],
        [
          "Infosys",
          "Investment",
          "AI Robotics Co.",
          "Invested in AI Robotics Co. to enhance AI-driven manufacturing",
          "2023"
        ],
        [
          "Wipro",
          "Acquisition",
          "Machine Learning Co.",
          "Acquired a machine learning company to boost their AI analytics services",
          "2020"
        ]
      ],
      "sub_object_type3": "bullet_points",
      "sub_object_type3_title": "Key Insights from AI-Related Deals Analysis",
      "sub_object_data3": [
        "Infosys has been more active in AI-related deals over the past 5 years, particularly in acquisitions and investments.",
        "Wipro's focus has been on partnerships, especially in AI-based cybersecurity solutions.",
        "Both companies are significantly investing in AI-driven automation and cloud infrastructure.",
        "In 2023, Infosys led in AI deal volume, driven by major investments in AI robotics."
      ]
    },
    {
      "Title": "Social Media Analysis of AI Strategy: Infosys vs Wipro",
      "Database": "Social Media",
      "Query": {
        "Company": ["Infosys", "Wipro"],
        "Topic": "Artificial Intelligence OR AI",
        "Timeline": "1–3 years",
        "Source": "Twitter influencers"
      },
      "sub_object_type1": "pie_chart",
      "sub_object_type1_title": "Popularity of Infosys vs Wipro in AI Discussions",
      "sub_object_data1": [
        ["Company", "AI Mentions"],
        ["Infosys", 500],
        ["Wipro", 650]
      ],
      "sub_object_type2": "table",
      "sub_object_type2_title": "Top Related Keywords for AI Strategy (2021-2023)",
      "sub_object_data2": [
        ["Company", "Keyword", "Frequency"],
        ["Infosys", "Automation", 320],
        ["Infosys", "Cloud AI", 250],
        ["Wipro", "AI-driven Innovation", 280],
        ["Wipro", "Ethical AI", 190]
      ],
      "sub_object_type3": "bullet_points",
      "sub_object_type3_title": "Summary of Social Media Discussions on AI Strategy",
      "sub_object_data3": [
        "Infosys received more mentions for automation and cloud-based AI solutions.",
        "Wipro was more frequently associated with ethical AI and AI-driven innovation.",
        "Mentions of AI strategy increased steadily for both companies, with Infosys consistently leading in total mentions.",
        "Infosys had a significant focus on integrating AI into automation processes, while Wipro emphasized innovation and responsible AI use."
      ]
    },
    {
      "Title": "AI Mentions Trend in News for Infosys and Wipro (Last 3 Years)",
      "Database": "News",
      "Query": {
        "Company": "Infosys, Wipro",
        "Topic": "Artificial Intelligence OR AI",
        "Timeline": "1-3 years"
      },
      "sub_object_type1": "line_chart",
      "sub_object_type1_title": "Trend of AI mentions over time in News for Infosys vs. Wipro",
      "sub_object_data1": [
        ["Year", "Infosys AI Mentions", "Wipro AI Mentions"],
        [2021, 150, 130],
        [2022, 200, 170],
        [2023, 250, 180]
      ],
      "sub_object_type2": "bullet_points",
      "sub_object_type2_title": "Key Insights from AI Mentions in News",
      "sub_object_data2": [
        "Infosys consistently had more AI-related mentions in the last three years compared to Wipro.",
        "Both companies saw an increase in AI mentions, with Infosys showing a sharper growth trend.",
        "Wipro's AI mentions plateaued in 2023, while Infosys saw significant media attention due to new AI partnerships and product launches."
      ]
    },
    {
      "Title": "AI-Related Job Postings for Infosys and Wipro (Last 5 Years)",
      "Database": "Jobs",
      "Query": {
        "Company": "Infosys, Wipro",
        "Topic": "Artificial Intelligence OR AI",
        "Timeline": "1-5 years"
      },
      "sub_object_type1": "bar_chart",
      "sub_object_type1_title": "AI Job Postings Comparison: Infosys vs. Wipro",
      "sub_object_data1": [
        ["Year", "Infosys AI Job Postings", "Wipro AI Job Postings"],
        [2019, 180, 160],
        [2020, 220, 190],
        [2021, 260, 220],
        [2022, 300, 250],
        [2023, 350, 270]
      ],
      "sub_object_type2": "table",
      "sub_object_type2_title": "Key AI-Related Job Roles at Infosys and Wipro",
      "sub_object_data2": [
        ["Company", "Role", "Seniority"],
        ["Infosys", "AI Engineer", "Mid-level"],
        ["Infosys", "Data Scientist (AI)", "Senior"],
        ["Wipro", "AI Research Scientist", "Mid-level"],
        ["Wipro", "AI/ML Solution Architect", "Senior"]
      ],
      "sub_object_type3": "bullet_points",
      "sub_object_type3_title": "Key Insights from AI Hiring Trends",
      "sub_object_data3": [
        "Infosys shows a higher growth rate in AI job postings compared to Wipro, reflecting its aggressive AI talent acquisition strategy.",
        "Wipro focuses on specialized roles in AI research and solution architecture, indicating a strategic push in high-level AI solutions.",
        "Infosys emphasizes both AI engineering and data science roles, suggesting a balanced focus on development and application of AI technologies."
      ]
    }
    
  ]


  return (
    <div className="space-y-8 p-8">
      {jsonData.map((item, index) => (
        <DynamicCard key={index} data={item} />
      ))}
    </div>
  )
}