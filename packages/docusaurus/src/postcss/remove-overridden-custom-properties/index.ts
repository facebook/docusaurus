import postcss, {Rule} from 'postcss';

export default postcss.plugin(
  'postcss-remove-overridden-custom-properties',
  () => {
    return (root) => {
      root.walkDecls((decl) => {
        if ((decl.parent as Rule).selector !== ':root') {
          return;
        }

        const sameProperties =
          decl.parent?.nodes?.filter((n: any) => n.prop === decl.prop) || [];
        const overriddenProperties = sameProperties.slice(0, -1);

        overriddenProperties.map((p) => p.remove());
      });
    };
  },
);
