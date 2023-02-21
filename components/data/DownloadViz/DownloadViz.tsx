import React, { useEffect } from 'react';
import { saveAs } from 'file-saver';
import { Download } from 'components/icons/Download';
import { Box, Button } from '@opub-cdl/design-system';
// import { Button } from 'components/actions';

function fileName(meta) {
  // If there is no type, eg: table, don;t add it to the name
  if (meta.constituency)
    return `${meta.constituency}_${meta.state}_${meta.scheme}_${meta.indicator}`.toLowerCase();
  else return `${meta.state}_${meta.scheme}_${meta.indicator}`.toLowerCase();
}

function download_csv(csv, filename) {
  const csvFile = new Blob([csv], { type: 'text/csv' });
  const downloadLink = document.createElement('a');

  // File name
  downloadLink.download = filename;

  // We have to create a link to the file
  downloadLink.href = window.URL.createObjectURL(csvFile);

  // Make sure that the link is not displayed
  downloadLink.style.display = 'none';

  // Add the link to your DOM
  document.body.appendChild(downloadLink);

  downloadLink.click();
}

export function export_table_to_csv(tableData, filename: any) {
  const csv = [];

  // Add table header content
  const tableHeader = tableData.header.map((item) => {
    return item['Header'];
  });
  csv.push(tableHeader);

  // Add table rows
  tableData.rows.forEach((item) => {
    csv.push(Object.values(item));
  });

  // Download CSV
  download_csv(csv.join('\n'), filename);
}

function createDummyCanvas(srcCanvas) {
  //create a dummy CANVAS
  const destinationCanvas = document.createElement('canvas');
  destinationCanvas.width = srcCanvas.width;
  destinationCanvas.height = srcCanvas.height;

  const destCtx = destinationCanvas.getContext('2d');

  //create a rectangle with the desired color
  destCtx.fillStyle = '#FFFFFF';
  destCtx.fillRect(0, 0, srcCanvas.width, srcCanvas.height);

  //draw the original canvas onto the destination canvas
  destCtx.drawImage(srcCanvas, 0, 0);

  //finally use the destinationCanvas.toDataURL() method to get the desired output;
  return destinationCanvas.toDataURL('image/jpeg', 2);
}

type Props = {
  viz: string;
  meta: any;
  tableData?: any;
};

const DownloadViz = ({ viz, meta, tableData = {} }: Props) => {
  let watermarkSSR;
  useEffect(() => {
    import('watermarkjs').then((x) => (watermarkSSR = x.default));
  }, [viz, meta]);
  function svg2img(canvasElm) {
    const myChart = createDummyCanvas(canvasElm);

    watermarkSSR([myChart, '/assets/images/obi.png'])
      .image(watermarkSSR.image.lowerRight(0.5))
      .then((img) => saveAs(img.src, `${fileName(meta)}.jpeg`.toLowerCase()));
  }

  async function downloadSelector(viz) {
    if (viz == '#tableView')
      export_table_to_csv(tableData, `${fileName(meta)}.csv`.toLowerCase());
    else {
      await import('html2canvas')
        .then((html2canvas) => {
          html2canvas
            .default(document.querySelector(viz), {
              scale: 2,
            })
            .then((canvasElm) => svg2img(canvasElm));
        })
        .catch((e) => {
          console.error('load failed');
        });
    }
  }

  return (
    <Button
      onClick={() => downloadSelector(viz)}
      size="compact"
      css={{
        display: 'flex',
        alignItems: 'center',
        color: 'var(--color-primary)',
        backgroundColor: 'rgb(238,246,253)',
        boxShadow: 'inset 0 0 0 2px #4190CC ',
        textDecoration: 'none !important',
      }}
      variant={'subtle-link'}
    >
      {`Download ${viz == '#tableView' ? 'CSV' : 'Visualization'}`}
      <Box css={{ marginLeft: '8px', fontSize: 0 }}>
        <Download fill="#4190CC" width="20" />
      </Box>
    </Button>
  );
};

export default DownloadViz;
