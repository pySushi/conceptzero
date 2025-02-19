'use client'
import React, { useState } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';

const databases = {
  'AVA Response':["Question","Companies","Date Range","Themes","Sources"],
  'Social Media': ['Companies', 'Concepts', 'Date Range','Themes','Free text',"Influencer Id","Sentiment","Geographies","Sector","Embedding Search"],
  'News': ['Companies', 'Concepts', 'Date Range','Themes','Free text',"Sentiment","Geographies","News Type","Sector","Embedding Search"],
  'Deals': ['Industry', 'Deal Type', 'Value Range','Companies', 'Concepts', 'Date Range','Themes','Free text',"Sentiment","Geographies","Embedding Search"],
  'Filings': ['Company', 'Filing Type', 'Date Range'],
  'Jobs': ['Company', 'Position', 'Location'],
  'Patents': ['Technology', 'Assignee', 'Filing Date']
};

const analyticsOptions = {
  'AVA Response':["AVA Response"],
  'Social Media': ['Top Posts','Top Themes','Top Companies','Top Hashtags', 'Top Influencers', 'Sentiment Analysis'],
  'News': ['Top News','Top Themes','Top Companies','Sentiment Analysis'],
  'Deals': ["Top deals",'Top Companies', 'Deal Value Distribution', 'Industry Breakdown'],
  'Filings': ['Filing Type Distribution', 'Top Companies', 'Key Financial Metrics'],
  'Jobs': ['Top Skills', 'Salary Range Distribution', 'Company Hiring Trends'],
  'Patents': ['Top Inventors', 'Technology Clusters', 'Filing Trends']
};

export default function GlobalDataPromptCardMaker() {
  const [systemPrompt, setSystemPrompt] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [selectedDatabases, setSelectedDatabases] = useState([]);
  const [analyticsToLoad, setAnalyticsToLoad] = useState({});
  const [resultCount, setResultCount] = useState(10);
  const [promptOutput, setPromptOutput] = useState('');

  const addDatabase = () => {
    setSelectedDatabases([...selectedDatabases, { name: '', fields: {} }]);
  };

  const removeDatabase = (index) => {
    const newDatabases = [...selectedDatabases];
    newDatabases.splice(index, 1);
    setSelectedDatabases(newDatabases);
  };

  const updateDatabase = (index, name) => {
    const newDatabases = [...selectedDatabases];
    newDatabases[index] = { name, fields: {} };
    setSelectedDatabases(newDatabases);
  };

  const updateDatabaseField = (dbIndex, field, value, takeUserInput) => {
    const newDatabases = [...selectedDatabases];
    newDatabases[dbIndex].fields[field] = { value, takeUserInput };
    setSelectedDatabases(newDatabases);
  };

  const toggleAnalytics = (dbName, option) => {
    setAnalyticsToLoad(prev => ({
      ...prev,
      [dbName]: {
        ...prev[dbName],
        [option]: !prev[dbName]?.[option]
      }
    }));
  };

  const handleTest = () => {
    // In a real application, this would open a popup for user inputs
    console.log('Test button clicked');
  };

  const handleRun = () => {
    // In a real application, this would process the inputs and generate output
    setPromptOutput('Sample output based on the selected parameters...');
  };

  const handleSave = () => {
    // In a real application, this would save the current state to a file
    console.log('Save button clicked');
  };

  return (
    <div className="max-w-max 7 mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6">GlobalData Prompt Card Maker</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Prompt Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">System Prompt</label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              rows="3"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder = "Persona of the analyst. E.g. You are an expert Social Media Analyst"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">User Prompt</label>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              rows="3"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder = "Describe how you want data to be processed by AI e.g. Based on given data create a battlecard for company"
            ></textarea>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Data Section</h2>
        <button
          onClick={addDatabase}
          className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-blue-600 flex items-center"
        >
          <Plus size={20} className="mr-2" /> Add Database
        </button>
        {selectedDatabases.map((db, index) => (
          <div key={index} className="mb-4 p-4 border rounded">
            <div className="flex justify-between items-center mb-2">
              <select
                className="block w-full bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={db.name}
                onChange={(e) => updateDatabase(index, e.target.value)}
              >
                <option value="">Select a database</option>
                {Object.keys(databases).map((dbName) => (
                  <option key={dbName} value={dbName}>
                    {dbName}
                  </option>
                ))}
              </select>
              <button onClick={() => removeDatabase(index)} className="ml-2 text-red-500 hover:text-red-700">
                <X size={20} />
              </button>
            </div>
            {db.name && (
              <div className="space-y-2">
                {databases[db.name].map((field) => (
                  <div key={field} className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder={field}
                      className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      value={db.fields[field]?.value || ''}
                      onChange={(e) => updateDatabaseField(index, field, e.target.value, db.fields[field]?.takeUserInput)}
                    />
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                        checked={db.fields[field]?.takeUserInput || false}
                        onChange={(e) => updateDatabaseField(index, field, db.fields[field]?.value, e.target.checked)}
                      />
                      <span className="ml-2 text-sm text-gray-600">Take user input</span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Analytics Section</h2>
        {selectedDatabases.map((db) => db.name && (
          <div key={db.name} className="mb-4">
            <h3 className="font-medium mb-2">{db.name} Analytics</h3>
            <div className="space-y-2">
              {analyticsOptions[db.name].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-offset-0 focus:ring-indigo-200 focus:ring-opacity-50"
                    checked={analyticsToLoad[db.name]?.[option] || false}
                    onChange={() => toggleAnalytics(db.name, option)}
                  />
                  <span className="ml-2">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Number of results to load</label>
          <input
            type="number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={resultCount}
            onChange={(e) => setResultCount(e.target.value)}
            min="1"
          />
        </div>
      </section>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={handleTest}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Test
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-green-600"
        >
          Save
        </button>
        <button
          onClick={handleRun}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-blue-600"
        >
          Run
        </button>
      </div>

      {promptOutput && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Prompt Output</h2>
          <div className="p-4 bg-gray-100 rounded">
            <pre>{promptOutput}</pre>
          </div>
        </section>
      )}
    </div>
  );
}
