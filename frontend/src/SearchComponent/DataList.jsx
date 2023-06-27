import React from "react";

export default function DataList({ data }) {
  return (
    <table>
      <tbody>
        <tr>
          <th>Name</th>
        </tr>
        {data.map((item) => (
          <tr key={item.id}>
            <th>{item.text}</th>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
