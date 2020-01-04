# IFC Commenter

Generates comments containing the content of references making IFC files easier to manually review.

## Example

```ifc
#71= IFCDERIVEDUNIT((#68,#69,#70),.THERMALTRANSMITTANCEUNIT.,$);
#73= IFCDERIVEDUNITELEMENT(#43,3);
```

**Becomes**:

```ifc
#71= IFCDERIVEDUNIT((#68,#69,#70),.THERMALTRANSMITTANCEUNIT.,$);
  /*#68= IFCDERIVEDUNITELEMENT(#59,1);*/
    /*#59= IFCSIUNIT(*,.MASSUNIT.,.KILO.,.GRAM.);*/
  /*#69= IFCDERIVEDUNITELEMENT(#66,-1);*/
    /*#66= IFCSIUNIT(*,.THERMODYNAMICTEMPERATUREUNIT.,$,.KELVIN.);*/
  /*#70= IFCDERIVEDUNITELEMENT(#64,-3);*/
    /*#64= IFCSIUNIT(*,.TIMEUNIT.,$,.SECOND.);*/
#73= IFCDERIVEDUNITELEMENT(#43,3);
  /*#43= IFCSIUNIT(*,.LENGTHUNIT.,$,.METRE.);*/
```

## Installation

Requires [node](https://nodejs.org) installed.

```sh
npm install --global ifc-commenter

ifc-commenter example.ifc
```