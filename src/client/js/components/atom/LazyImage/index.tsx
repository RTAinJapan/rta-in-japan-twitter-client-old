import React from 'react';
import LazyLoad from 'react-lazyload';

type ComponentProps = {
  imageUrl: string;
  height: number;
};

type PropsType = ComponentProps;
const LazyImage: React.SFC<PropsType> = (props: PropsType) => {
  return (
    <LazyLoad height={props.height}>
      <img src={props.imageUrl} height={props.height} />
    </LazyLoad>
  );
};

export default LazyImage;
