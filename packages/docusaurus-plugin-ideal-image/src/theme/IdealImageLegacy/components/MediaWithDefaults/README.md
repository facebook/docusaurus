All possible states of the component

```js
const lqip =
  'data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAA4DASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUG/8QAIRAAAQQDAAEFAAAAAAAAAAAAAQIDBREABAYhEjEyQVH/xAAUAQEAAAAAAAAAAAAAAAAAAAAE/8QAGBEBAAMBAAAAAAAAAAAAAAAAAQACIRH/2gAMAwEAAhEDEQA/AMJ2DG+7Dw0nz8gsx+uyhlxnWdLakOlfzpIF3aRf1WT5t96P5+N1ug9Tu7ZWS8q1gG6B8H2FDz+YxhjUrEOdZ//Z';

const sqip =
  "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4774 3024'%3e%3cfilter id='b'%3e%3cfeGaussianBlur stdDeviation='12' /%3e%3c/filter%3e%3cpath fill='%23515a57' d='M0 0h4774v3021H0z'/%3e%3cg filter='url(%23b)' transform='translate(9.3 9.3) scale(18.64844)' fill-opacity='.5'%3e%3cellipse fill='whitefef' rx='1' ry='1' transform='matrix(74.55002 60.89891 -21.7939 26.67923 151.8 104.4)'/%3e%3cellipse fill='black80c' cx='216' cy='49' rx='59' ry='59'/%3e%3cellipse fill='black60e' cx='22' cy='60' rx='46' ry='89'/%3e%3cellipse fill='%23ffebd5' cx='110' cy='66' rx='42' ry='28'/%3e%3cellipse fill='whiteff9' rx='1' ry='1' transform='rotate(33.3 -113.2 392.6) scale(42.337 17.49703)'/%3e%3cellipse fill='%23031f1e' rx='1' ry='1' transform='matrix(163.4651 -64.93326 6.77862 17.06471 111 16.4)'/%3e%3cpath fill='whitefea' d='M66 74l9 39 16-44z'/%3e%3cellipse fill='%23a28364' rx='1' ry='1' transform='rotate(-32.4 253.2 -179) scale(30.79511 43.65381)'/%3e%3cpath fill='%231a232c' d='M40 139l61-57 33 95z'/%3e%3cpath fill='%230a222b' d='M249.8 153.3l-48.1-48 32.5-32.6 48.1 48z'/%3e%3c/g%3e%3c/svg%3e";
<table>
  <tbody>
    <tr>
      <th align="left" width="100">
        load
      </th>
      <td>
        <MediaWithDefaults
          width={3500}
          height={2095}
          placeholder={{lqip: lqip}}
          src="andre-spieker-238-unsplash.jpg"
          style={{maxWidth: 200}}
          icon={'load'}
        />
      </td>
      <th align="left" width="100">
        noicon
      </th>
      <td>
        <MediaWithDefaults
          width={3500}
          height={2095}
          placeholder={{lqip: lqip}}
          src="andre-spieker-238-unsplash.jpg"
          style={{maxWidth: 200}}
          icon={'noicon'}
        />
      </td>
    </tr>
    <tr>
      <th align="left">loading</th>
      <td>
        <MediaWithDefaults
          width={3500}
          height={2095}
          placeholder={{lqip: lqip}}
          src="andre-spieker-238-unsplash.jpg"
          style={{maxWidth: 200}}
          icon={'loading'}
        />
      </td>
      <th align="left">offline</th>
      <td>
        <MediaWithDefaults
          width={3500}
          height={2095}
          placeholder={{lqip: lqip}}
          src="andre-spieker-238-unsplash.jpg"
          style={{maxWidth: 200}}
          icon={'offline'}
        />
      </td>
    </tr>
    <tr>
      <th align="left">loaded</th>
      <td>
        <MediaWithDefaults
          width={3500}
          height={2095}
          placeholder={{lqip: lqip}}
          src="andre-spieker-238-unsplash.jpg"
          style={{maxWidth: 200}}
          icon={'loaded'}
        />
      </td>
      <th align="left">error</th>
      <td>
        <MediaWithDefaults
          width={3500}
          height={2095}
          placeholder={{lqip: lqip}}
          src="andre-spieker-238-unsplash.jpg"
          style={{maxWidth: 200}}
          icon={'error'}
        />
      </td>
    </tr>
  </tbody>
</table>;
```
