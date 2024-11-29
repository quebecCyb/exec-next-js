import React, {useCallback, useEffect, useState} from 'react';
import {json} from "node:stream/consumers";
import RadarChart from "@/components/analysis/radar";
import StrategyTable from "@/components/analysis/strat-table";
import SwotTable from "@/components/analysis/swot-table";
import ClusterTable from "@/components/analysis/cluster-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CsfTable from "@/components/analysis/csf-table";
import CSFKPITable from "@/components/analysis/kpi-table";
import PerspectiveKPITable from "@/components/analysis/kpi-connections";
import ReportImport from "@/components/analysis/report-import";
import KpiActualTargets from "@/components/analysis/kpi-actual-targets";
// import {useRequiredReport} from "@/components/analysis/contexts/ReportContext";

import { KPI, SWOTItem, SaveData, Clusters, Cluster, TableData } from "@/components/analysis/schemas/Analysis";
import SwotStats from "@/components/analysis/schemas/swot";

const SwotList = ({projectId}) => {
    const [isSaving, setIsSaving] = useState(false);
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null); // Adjusted state type for NodeJS.Timeout

    // Initialize state for each input field
    const [strength, setStrength] = useState('Strong Brand Reputation');
    const [weaknesses, setWeaknesses] = useState('High Operating Costs');
    const [opportunities, setOpportunities] = useState('Strategic Partnerships');
    const [threats, setThreats] = useState('Intense Competition ');

    const [chartData, setChartData] = useState(null);
    const [businessDescription, setBusinessDescription] = useState('Basic Description');
    const [tableData, setTableData] = useState<TableData | null>(null);

    // Handle input change events
    const handleStrengthChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setStrength(e.target.value);
    };

    const handleWeaknessesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setWeaknesses(e.target.value);
    };
    const handleDescChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBusinessDescription(e.target.value);
    };

    const handleOpportunitiesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setOpportunities(e.target.value);
    };

    const handleThreatsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setThreats(e.target.value);
    };

    const load = useCallback(async () => {
        try {
            const response = await fetch(`/api/load/${projectId}`);
            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`);
            }

            const data: SaveData = await response.json();

            // Populate fields with the fetched data
            setStrength(data.swot.strength);
            setWeaknesses(data.swot.weaknesses);
            setOpportunities(data.swot.opportunities);
            setThreats(data.swot.threats);
            // setRequiredReport(data.requiredReport);
            setTableData(data.analysis);
        } catch (error) {
            console.error("Failed to load data:", error);
        }
    }, [projectId]);

    // Fetch data when the component loads
    useEffect(() => {
        load();
    }, [load]);


    const save = useCallback(async () => {
        setIsSaving(true);

        const saved: SaveData = {
            swot: {
                strength,
                weaknesses,
                opportunities,
                threats,
            },
            requiredReport: [],
            extractReport: [],
            analysis: tableData,
        } as SaveData;

        try {
            // Send POST request to API endpoint
            const response = await fetch(`/api/save/${projectId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saved),
            });

            if (!response.ok) {
                throw new Error(`Error saving report: ${response.statusText}`);
            }

            console.log('Report saved successfully!');
        } catch (error) {
            console.error('Failed to save report:', error);
        } finally {
            setIsSaving(false);
        }
    }, [strength, weaknesses, opportunities, threats, [], tableData]);

    // Handle content change
    const handleChange = () => {
        // Reset the timer if there's a new change
        if (timer) clearTimeout(timer);

        // Set a new timer to save after 10 seconds if no further changes
        setTimer(
          setTimeout(() => {
              save();
          }, 10000)
        );
    };

    // Clear the timer on component unmount to prevent memory leaks
    useEffect(() => {
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [timer]);


    // Handle form submission
    const analyze = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevents the default form submission behavior
        console.log("Form submitted!"); // Log the submission to the console


        try {
            // Make a POST request to the server
            const response = await fetch('/api/swot/csf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    swot: `Strength: ${strength}; Weaknesses: ${weaknesses}; opportunities: ${opportunities}; threats: ${threats}`
                })
            });

            if (response.ok) {
                // Handle success
                const data = await response.json();
                console.log("Success Of Chart:", data.data.clusters.required_kpi);

                setChartData(data.data.chart);
                setTableData(data.data);

                // setRequiredReport(data.data.clusters.required_kpi)
                handleChange();

            } else {
                // Handle error
                console.error("Error:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error);
        }
        await save();
    };

    const generateSwot = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevents the default form submission behavior
        try {
            // Make a POST request to the server
            const response = await fetch('/api/swot/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    swot: businessDescription
                })
            });

            if (response.ok) {
                // Handle success

                const data = await response.json();


                setStrength(data.data.strength.join(';\n'));
                setWeaknesses(data.data.weaknesses.join(';\n'));
                setOpportunities(data.data.opportunities.join(';\n'));
                setThreats(data.data.threats.join(';\n'));
                handleChange();

            } else {
                // Handle error
                console.error("Error:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const getChart = async () => {
        try {
            // Make a POST request to the server
            console.log('Getting chart!')
            const response = await fetch('/api/swot/csf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    swot: `Strength: ${strength}; Weaknesses: ${weaknesses}; opportunities: ${opportunities}; threats: ${threats}`
                })
            });

            if (response.ok) {
                // Handle success
                const data = await response.text();
                console.log("Success Of Chart:", data);
            } else {
                // Handle error
                console.error("Error:", response.statusText);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    return (
      <>

          <Card>
              <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                      <SwotStats />
                  </div>
              </CardContent>
          </Card>

          <Card>
              <CardContent className="p-4">
                <form onSubmit={generateSwot}>

              <label>Business Description</label>

              <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                  <input
                    type="text"
                    name="bidesc"
                    placeholder="business description"
                    value={businessDescription}
                    onChange={handleDescChange}
                  />

                  <button type="submit"
                          className="px-4 py-2 font-medium text-white bg-purple-600 rounded-lg focus:outline-none focus:shadow-outline-purple">
                      Submit
                  </button>

              </div>
          </form>
              </CardContent>
          </Card>

          <Card>
              <CardContent className="p-4">
                    <form onSubmit={analyze} className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
              <label>Strengths</label>
              <label>Weaknesses</label>
              <label>Opportunities</label>
              <label>Threats</label>

              <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                    <textarea
                      name="strength"
                      placeholder="Strength"
                      value={strength}
                      onChange={handleStrengthChange}
                    />
              </div>
              <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                    <textarea
                      name="weaknesses"
                      placeholder="Weaknesses"
                      value={weaknesses}
                      onChange={handleWeaknessesChange}
                    />
              </div>
              <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                    <textarea
                      name="opportunities"
                      placeholder="Opportunities"
                      value={opportunities}
                      onChange={handleOpportunitiesChange}
                    />
              </div>
              <div className="flex items-center p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800">
                    <textarea
                      name="threats"
                      placeholder="Threats"
                      value={threats}
                      onChange={handleThreatsChange}
                    />
              </div>
              <button type="submit"
                      className="px-4 py-2 font-medium text-white bg-purple-600 rounded-lg focus:outline-none focus:shadow-outline-purple">
                  Submit
              </button>
          </form>
              </CardContent>
          </Card>



          <Card>
              <CardContent className="p-4">
                  <h2>SWOT</h2>
                  {(strength || weaknesses || opportunities || threats) &&
                    <SwotTable strengths={strength} weaknesses={weaknesses} opportunities={opportunities}
                               threats={threats}/>}
              </CardContent>
          </Card>



          <Card>
              <CardContent className="p-4">
                  <h2>Clusters</h2>

                  {tableData && <ClusterTable clusters={tableData.clusters.clusters}/>}
              </CardContent>
          </Card>


          <Card>
              <CardContent className="p-4">
                  <h2>Critical success factors</h2>

                  {tableData && <CsfTable clusters={tableData.clusters.clusters}/>}
              </CardContent>
          </Card>


          <Card>
              <CardContent className="p-4">
          <h2>Strategy</h2>

          {tableData && <StrategyTable clusters={tableData.clusters}/>}
              </CardContent>
          </Card>


          <Card>
              <CardContent className="p-4">

          <ReportImport/>
              </CardContent>
          </Card>


          <Card>
              <CardContent className="p-4">
          <h2>KPI Extracted</h2>
          <KpiActualTargets />
              </CardContent>
          </Card>


          <Card>
              <CardContent className="p-4">

          <h2>KPI</h2>
          {tableData && <CSFKPITable clusters={tableData.clusters.clusters}/>}
              </CardContent>
          </Card>


          <Card>
              <CardContent className="p-4">
          <h2>Mapping</h2>
          {tableData && <PerspectiveKPITable clusters={tableData.clusters.clusters}/>}

              </CardContent>
          </Card>


          <Card>
              <CardContent className="p-4">
          <h2>Radar</h2>
          {tableData && <RadarChart clusters={tableData.clusters.clusters}/>}
              </CardContent>
          </Card>

      </>
    );
};

export default SwotList;
