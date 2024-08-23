import React, { Component } from "react"; //Importing the function component from react as react
import { Table, TableData } from "@finos/perspective"; //Importing the function table from @finos/perspective
import { ServerRespond } from "./DataStreamer"; //Importing the serverrespong function from Datastreamer
import { DataManipulator } from "./DataManipulator"; //Importing DataManipulator from DataManipulator
import "./Graph.css"; //Importing graph.css file

//Creating an interface called IProps
interface IProps {
  //Any object implementing the interface IProps must have a property called data
  data: ServerRespond[];
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void;
}
//Creating a graph class that is implementing the interface IProps
class Graph extends Component<IProps, {}> {
  //Any object belonging to the graph class has a table property which is a Table with undefined varible types
  table: Table | undefined;

  //This is the render method within the graph class which allows any object within this class to be able to render the graph
  render() {
    //Rendering the grah using perspective-viewer when function is called
    return React.createElement("perspective-viewer");
  }

  //This function called componentsDidMount and is used to configure the graph to be rendered
  componentDidMount() {
    // Get element from the DOM. ***
    const elem = (document.getElementsByTagName(
      "perspective-viewer"
    )[0] as unknown) as PerspectiveViewerElement;

    //This is the schema that the table will have and the datatype of each
    const schema = {
      timestamp: "date",

      //MY CODE
      ratio: "float",
      upper_bound: "float",
      lower_bound: "float",
      trigger_alert: "float",
      price_abc: "float",
      price_def: "float",
      //MY CODE
    };

    //Setting the schema to the table based on a conditional if statement
    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }

    //if the table exists then...
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference. ***
      elem.load(this.table);
      elem.setAttribute("view", "y_line");
      elem.setAttribute("row-pivots", '["timestamp"]');

      //MY CODE
      elem.setAttribute(
        "columns",
        '["ratio", "upper_bound", "lower_bound", "trigger_alert"]'
      );

      elem.setAttribute(
        "aggregates",
        JSON.stringify({
          timestamp: "distinct count",
          ratio: "avg",
          upper_bound: "avg",
          lower_bound: "avg",
          trigger_alert: "avg",
          price_abc: "avg",
          price_def: "avg",
        })
      );
      //MY CODE
    }
  }

  //Function used to update the table when needed
  componentDidUpdate() {
    //Conditional if statement used to check if the table exists
    if (this.table) {
      //If it does then the table is updated using the props method to the IProps interface which in turn has the data property which contains an array of data from the server
      this.table.update(([
        DataManipulator.generateRow(this.props.data),
      ] as unknown) as TableData);
    }
  }
}

export default Graph;
