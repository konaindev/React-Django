import PropTypes from "prop-types";
import React from "react";

import RegionMap from "./region_map";
import "./us_sub_region_map.scss";

export default class SouthRegionMap extends RegionMap {
  static defaultProps = {
    width: 703,
    height: 412
  };

  static tooltipAlign = {
    md: [280, 20],
    de: [300, 20],
    wv: [200, 45],
    tx: [-180, 240],
    la: [-40, 250],
    ky: [100, 90],
    va: [250, 60],
    fl: [200, 300],
    sc: [220, 170],
    nc: [250, 120],
    ar: [-35, 160],
    al: [90, 200],
    tn: [100, 135],
    ok: [-140, 145],
    ms: [30, 210],
    ga: [160, 200]
  };

  render() {
    return (
      <svg
        width={this.props.width}
        height={this.props.height}
        viewBox="0 0 703 412"
      >
        <path
          className={this.getStateClassName("md")}
          d="M669.197 37.0108L656.131 39.5511L648.253 8.08203L573.836 20.2688L576.269 34.2026L583.247 26.6355L586.205 27.3215L588.767 22.1981C588.767 22.1981 592.797 23.2699 593.74 23.0019C594.683 22.734 598.445 18.1573 601.136 18.1573C603.741 18.3014 606.26 19.1376 608.435 20.5796C608.82 20.958 609.178 21.3627 609.507 21.7908C610.675 23.227 612.133 25.2849 612.133 25.2849L616.42 26.2282C616.42 26.2282 615.069 29.5937 616.42 30.1297C617.77 30.6656 623.548 31.2015 624.995 34.9743C626.195 38.0291 625.938 43.3775 625.798 45.2854C628.264 44.6315 637.149 47.2683 638.575 47.429C640.788 48.0368 642.941 48.8477 645.006 49.8514L640.718 42.863L637.76 29.9474L638.039 23.763C638.039 23.763 641.533 16.5066 643.398 17.0425C643.666 23.227 647.171 22.9591 645.542 24.0309C643.912 25.1028 645.542 29.1436 646.346 32.3698C647.149 35.596 645.542 41.7805 647.16 42.863C648.779 43.9456 653.345 44.4708 655.735 46.6252C658.125 48.7795 659.508 51.9843 659.508 53.3456C659.508 54.7068 654.931 71.899 658.693 74.0534C662.455 76.2078 663.806 68.1369 664.052 64.4069C664.299 60.6769 668.34 50.4195 668.093 48.5438C667.846 46.668 667.021 43.1846 667.021 43.1846C668.138 41.3399 668.837 39.2727 669.068 37.1287L669.197 37.0108Z"
          onMouseEnter={() => this.props.onMouseEnter("md")}
        />
        <text
          className="us-sub-region-map__label us-sub-region-map__label--md"
          x="617"
          y="26"
        >
          MD
        </text>
        <path
          className={this.getStateClassName("de")}
          d="M668.769 34.246C667.332 30.9126 657.257 16.1856 654.974 12.8736L654.513 12.1984H654.685L655.296 12.3484C654.535 11.0837 653.259 8.73632 653.259 7.23576C653.259 6.58194 654.235 5.17785 655.607 3.46291C650.73 1.71583 648.79 6.32471 648.254 8.05036L656.132 39.5515L669.198 37.0113C669.271 36.0687 669.124 35.1221 668.769 34.246V34.246Z"
          onMouseEnter={() => this.props.onMouseEnter("de")}
        />
        <text className="us-sub-region-map__label" x="664" y="19">
          DE
        </text>
        <path
          className={this.getStateClassName("wv")}
          d="M609.53 21.7368C609.201 21.3087 608.843 20.904 608.458 20.5256C606.284 19.0836 603.764 18.2474 601.159 18.1033C598.469 18.1033 594.728 22.68 593.763 22.948C592.799 23.2159 588.79 22.1441 588.79 22.1441L586.228 27.2675L583.249 26.6351L576.26 34.2987L573.827 20.3648L553.58 23.6768L550.215 0C549.143 0.332268 546.903 1.13614 547.31 2.33659C548.232 4.61401 548.698 7.05023 548.682 9.50716C548.564 12.7227 547.492 25.1024 546.41 27.439C545.327 29.7755 535.113 37.2998 534.405 38.1573C533.698 39.0148 532.069 43.9023 532.069 43.9023C532.069 43.9023 531.533 47.3108 530.815 47.8467C530.096 48.3826 526.688 45.8745 525.08 47.8467C523.472 49.8188 525.08 57.4932 525.08 59.1331C525.08 60.2692 520.675 61.9306 518.596 64.8674C518.11 65.496 517.778 66.2297 517.628 67.0096C517.477 67.7896 517.511 68.594 517.727 69.3584C518.686 73.069 520.442 76.5263 522.872 79.4897C525.303 82.4532 528.349 84.8517 531.801 86.5184L532.111 86.6792C540.9 90.8057 536.056 93.4961 537.674 93.6676C539.293 93.8391 545.917 90.0876 545.917 90.0876C547.192 90.4865 548.538 90.6125 549.866 90.4574C551.193 90.3022 552.474 89.8695 553.623 89.1873C555.796 87.8453 557.822 86.279 559.668 84.5141C559.668 84.5141 563.956 84.6856 566.303 82.5419C568.65 80.3983 566.839 76.6254 568.093 73.9673C569.347 71.3091 572.573 63.5704 573.452 60.5157C574.331 57.461 575.96 51.0193 575.96 51.0193C575.96 51.0193 583.131 56.7536 583.849 54.7814C584.567 52.8093 586.539 45.285 589.208 42.7662C591.877 40.2474 599.165 35.4241 598.94 33.6234C598.715 31.8227 598.94 23.5911 598.94 23.5911L609.283 29.6791C609.283 29.6791 610.72 25.1023 609.53 21.7368Z"
          onMouseEnter={() => this.props.onMouseEnter("wv")}
        />
        <text className="us-sub-region-map__label" x="542" y="61">
          WV
        </text>
        <path
          className={this.getStateClassName("tx")}
          d="M293.457 274.378C293.457 272.406 288.795 259.501 287.895 258.611C286.994 257.722 282.696 251.108 282.696 251.108C282.696 251.108 282.332 234.623 282.514 223.991C282.514 221.794 282.61 219.843 282.696 218.342C283.232 209.607 272.664 207.72 272.664 207.72V207.302C271.229 207.48 269.773 207.378 268.376 207.002C266.233 206.295 259.802 201.268 257.658 200.196C255.514 199.124 253.714 201.632 252.631 201.632C251.549 201.632 249.416 199.832 247.615 199.832C245.675 200.017 243.756 200.375 241.881 200.904C241.881 200.904 235.782 205.92 232.234 204.848C228.686 203.776 224.356 199.821 222.202 198.749C220.047 197.677 215.771 204.848 215.771 204.848L213.97 200.089H208.611C207.333 199.705 205.985 199.614 204.667 199.821C202.409 200.191 200.107 200.191 197.85 199.821C196.778 199.467 196.778 194.805 194.27 193.39C191.762 191.975 185.695 193.39 185.695 193.39H177.806L170.636 190.175C170.636 190.175 169.918 185.887 168.835 185.158C167.753 184.43 160.261 185.158 160.261 185.158L153.83 180.142L155.051 129.53L92.7458 124.664L81.5558 245.138L0 235.299V240.583L3.75142 241.033L36.0136 276.532C36.0136 276.532 36.5495 297.508 41.1263 302.621C45.703 307.733 61.8341 323.596 70.1622 321.442C78.4904 319.288 80.8806 302.889 87.9118 302.889C94.943 302.889 112.714 304.764 112.714 304.764L128.577 323.864C128.577 323.864 135.008 341.346 138.224 345.644C141.439 349.942 141.718 356.673 143.583 358.013C145.448 359.353 153.797 365.816 153.797 365.816C153.797 365.816 159.982 396.47 168.589 401.036C177.196 405.602 211.344 411.755 211.344 411.755L204.624 387.017L207.046 379.514L202.201 376.556L208.632 375.216L211.323 366.877L206.221 363.662C208.506 362.882 210.749 361.984 212.941 360.971C214.268 359.878 215.443 358.613 216.435 357.209L214.292 354.787C214.292 354.787 217.786 352.9 220.723 351.025C223.66 349.149 229.062 347.252 229.297 346.18C229.533 345.108 227.69 340.821 227.69 339.995C227.69 339.17 236.264 338.924 237.636 338.924C239.008 338.924 243.821 342.418 246.779 340.799C249.737 339.181 257.262 334.883 258.076 334.368C258.891 333.854 261.292 321.999 261.034 318.773C260.777 315.547 261.034 310.199 263.178 309.362C265.322 308.526 264.529 316.865 266.136 316.865C267.744 316.865 277.701 313.65 281.142 312.824C282.342 312.546 284.572 312.214 287.198 311.892C284.475 306.876 290.467 302.706 290.467 300.541C290.467 298.033 290.285 290.895 290.467 288.751C290.649 286.607 293.457 276.371 293.457 274.378Z"
          onMouseEnter={() => this.props.onMouseEnter("tx")}
        />
        <text className="us-sub-region-map__label" x="161" y="271">
          TX
        </text>
        <path
          className={this.getStateClassName("la")}
          d="M396.083 320.094C393.125 316.064 383.982 314.456 384.293 309.611C384.604 304.767 392.096 306.117 391.024 300.469C389.953 294.82 383.522 299.933 381.378 300.201C379.234 300.469 378.162 295.913 377.091 296.985C376.019 298.057 365.525 303.706 365.3 296.449C365.075 289.193 379.052 292.098 384.786 292.408C383.146 289.847 380.156 285.216 379.642 284.445C378.923 283.373 379.288 274.798 379.288 274.798C379.288 274.798 338.408 276.588 338.054 274.798C337.701 273.008 339.844 266.91 339.844 264.08C339.844 261.25 348.087 247.949 348.087 247.949L351.677 240.778C351.677 240.778 347.733 231.453 346.661 226.073C346.543 225.494 346.447 224.797 346.372 224.047H282.512C282.33 234.679 282.694 251.164 282.694 251.164C282.694 251.164 286.982 257.799 287.893 258.667C288.804 259.535 293.455 272.462 293.455 274.434C293.455 276.406 290.765 286.631 290.583 288.786C290.401 290.94 290.583 298.1 290.583 300.576C290.583 302.719 284.591 306.91 287.314 311.927C292.441 311.256 297.609 310.941 302.78 310.983C308.686 311.251 318.376 315.013 324.292 314.199C330.209 313.384 327.25 308.004 330.209 307.768C333.167 307.532 346.072 321.487 349.834 322.291C353.596 323.095 367.315 323.363 371.881 322.291C376.447 321.219 374.84 315.86 376.726 315.86C378.613 315.86 386.941 320.705 389.899 325.271C392.321 325.475 399.042 324.135 396.083 320.094Z"
          onMouseEnter={() => this.props.onMouseEnter("la")}
        />
        <text className="us-sub-region-map__label" x="309" y="272">
          LA
        </text>
        <path
          className={this.getStateClassName("ky")}
          d="M517.725 69.294C517.508 68.5297 517.474 67.7253 517.625 66.9453C517.776 66.1653 518.107 65.4316 518.593 64.803C517.264 63.2703 512.516 61.2767 511.626 60.6872C510.554 59.9691 510.2 57.6432 509.118 56.2069C508.035 54.7707 504.284 61.5661 501.765 61.9413C499.246 62.3164 499.085 58.7258 496.406 58.8973C493.726 59.0687 493.898 61.2231 492.815 61.5875C491.733 61.952 489.6 59.0687 488.335 58.715C487.07 58.3613 483.672 62.295 482.236 57.2788C480.8 52.2626 473.115 51.0729 469.514 51.7267H469.439C465.966 52.4663 469.867 59.4224 468.795 60.6658C467.25 62.0357 465.293 62.8538 463.233 62.9917C462.161 62.8202 459.47 62.102 458.752 62.9917C458.034 63.8813 458.752 67.4826 458.752 67.4826C456.15 69.2426 453.851 71.4147 451.946 73.9136C449.256 77.6758 450.146 81.8023 449.074 84.1282C448.002 86.4541 441.903 80.7198 439.931 82.156C437.959 83.5923 436.522 87.3544 436.522 87.3544C436.522 87.3544 431.86 85.5645 429.888 85.7467C427.916 85.9289 423.618 90.9451 423.082 90.4092C422.546 89.8732 420.209 89.1551 419.137 88.437C418.066 87.7189 412.856 89.5088 410.166 89.8625C408.241 90.275 406.403 91.0184 404.732 92.0598L404.614 92.5636V99.7341C404.614 99.7341 398.183 102.242 398.183 103.325V112.639L387.786 110.131L383.295 117.634L383.842 117.998C383.842 117.998 383.842 122.768 382.041 124.515C380.969 125.587 379.029 127.73 377.754 129.274L407.712 126.423V122.028C407.712 122.028 418.655 120.956 440.167 118.813C450.992 117.741 478.656 114.643 509.118 110.892C514.991 106.605 520.833 96.047 520.833 96.047L531.798 86.5184C528.34 84.8449 525.289 82.4365 522.858 79.4614C520.427 76.4864 518.675 73.0164 517.725 69.294V69.294Z"
          onMouseEnter={() => this.props.onMouseEnter("ky")}
        />
        <text
          className="us-sub-region-map__label us-sub-region-map__label--ky"
          x="458"
          y="99"
        >
          KY
        </text>
        <path
          className={this.getStateClassName("va")}
          d="M662.737 86.6593C662.073 83.5617 661.483 80.3355 659.629 80.7427C657.206 81.2787 649.403 81.0107 649.403 81.0107L652.898 77.5165L649.682 71.0855L652.64 69.7457C652.64 69.7457 647.281 67.0554 647.538 63.8292C647.796 60.603 649.146 57.3982 646.467 54.4185C643.787 51.4388 630.336 51.7282 626.037 47.1515C624.966 46.0261 625.094 45.458 625.898 45.2329C626.037 43.325 626.295 37.9766 625.094 34.9219C623.615 31.149 617.827 30.6345 616.52 30.0771C615.212 29.5198 616.52 26.1757 616.52 26.1757L612.232 25.2325C612.232 25.2325 610.775 23.1745 609.606 21.7383C610.796 25.1038 609.413 29.6698 609.413 29.6698L599.07 23.5818C599.07 23.5818 598.834 31.8243 599.07 33.6142C599.306 35.4042 592.028 40.2489 589.338 42.757C586.648 45.265 584.675 52.8 583.979 54.7722C583.282 56.7444 576.09 51.0101 576.09 51.0101C576.09 51.0101 574.482 57.4411 573.582 60.5065C572.682 63.572 569.455 71.2248 568.223 73.958C566.99 76.6912 568.759 80.389 566.433 82.5327C564.107 84.6764 559.67 84.5156 559.67 84.5156C557.806 86.276 555.761 87.8352 553.571 89.1673C552.421 89.8496 551.141 90.2823 549.813 90.4374C548.486 90.5925 547.14 90.4666 545.864 90.0677C545.864 90.0677 539.23 93.8298 537.622 93.6476C536.014 93.4654 540.837 90.7858 532.059 86.6593L531.748 86.4985L520.762 95.9842C520.762 95.9842 514.921 106.499 509.047 110.829C519.765 109.511 530.837 108.107 541.641 106.67C561.106 104.098 579.724 101.429 593.915 99.0282C627.742 93.3046 652.866 89.1352 662.898 87.4631C662.855 87.2166 662.791 86.9594 662.737 86.6593Z"
          onMouseEnter={() => this.props.onMouseEnter("va")}
        />
        <text className="us-sub-region-map__label" x="597" y="74">
          VA
        </text>
        <path
          className={this.getStateClassName("fl")}
          d="M615.253 397.007C615.253 397.007 618.469 376.299 614.717 364.466C610.966 352.633 596.432 326.555 596.432 326.555L594.545 316.598C594.545 316.598 581.908 302.096 577.064 290.52C572.465 279.523 568.114 270.723 566.999 263.178C564.716 263.178 557.353 263.113 555.552 263.264C553.408 263.446 557.888 274.378 555.552 275.279C553.215 276.179 550.718 270.263 550.718 270.263C550.718 270.263 493.343 274.025 491.199 274.025C489.473 274.025 487.115 268.666 486.247 266.522L432.57 271.71C432.57 271.71 428.089 273.146 429.708 276.736C431.326 280.327 433.47 280.681 433.47 280.681L433.609 286.758C436.407 285.215 440.726 282.739 440.726 282.739V285.429L459.548 282.214V285.976L474.875 292.407L484.832 300.478C484.832 300.478 500.16 295.118 503.386 291.603C506.612 288.087 511.457 285.418 516.248 288.645C521.039 291.871 525.701 299.952 530.01 302.096C534.319 304.24 541.575 306.941 543.719 308.527C545.863 310.113 546.409 340.253 547.76 341.604C548.081 341.982 548.505 342.259 548.981 342.402C549.456 342.544 549.963 342.547 550.439 342.408V339.717C551.325 339.765 552.158 340.157 552.759 340.81C553.36 341.462 553.681 342.325 553.655 343.212C553.923 346.706 550.439 351.786 553.655 356.663C556.87 361.54 563.065 365.806 563.065 365.806L567.096 365.538L568.714 369.825L570.054 371.969L574.341 378.957L577.557 388.1C577.557 388.1 584.288 388.1 586.699 389.986C589.111 391.873 593.431 399.933 594.502 405.582C598.532 412.013 612.788 401.541 612.788 401.541L615.253 397.007Z"
          onMouseEnter={() => this.props.onMouseEnter("fl")}
        />
        <text className="us-sub-region-map__label" x="564" y="331">
          FL
        </text>
        <path
          className={this.getStateClassName("sc")}
          d="M592.126 151.042L568.245 153.55C568.245 153.55 565.609 145.79 544.965 145.908C527.816 146.004 532.564 151.202 518.03 154.311C516.337 157.044 512.671 163.153 513.389 164.129C514.279 165.383 524.858 170.217 524.858 170.217C524.858 170.217 531.674 181.514 533.818 182.768C535.962 184.022 546.369 190.271 548.159 193.486C549.949 196.702 551.375 199.403 552.447 200.121C553.518 200.839 558.545 202.983 559.617 204.955C560.924 208.108 562.062 211.328 563.026 214.601C563.026 214.601 567.313 216.027 568.224 217.817C569.135 219.607 569.832 226.059 571.439 226.595C572.751 226.991 574.082 227.32 575.427 227.581C576.842 224.312 578.074 221.847 578.074 221.847L582.179 219.564C582.179 219.564 578.149 214.73 578.149 213.133C578.149 211.536 589.436 212.865 592.662 210.443C595.888 208.02 595.877 208.02 600.165 200.496C610.111 193.497 607.957 187.045 607.957 187.045C607.957 187.045 617.207 174.408 618.364 172.253C618.643 171.865 619.011 171.549 619.436 171.331L592.126 151.042Z"
          onMouseEnter={() => this.props.onMouseEnter("sc")}
        />
        <text className="us-sub-region-map__label" x="558" y="181">
          SC
        </text>
        <path
          className={this.getStateClassName("nc")}
          d="M668.77 106.584L664.482 111.15L662.607 106.049C662.607 106.049 653.464 109.543 651.578 108.739C649.691 107.935 650.238 105.234 650.238 105.234C650.238 105.234 652.381 106.584 656.669 104.162C660.956 101.74 664.461 98.803 666.615 100.668C668.77 102.533 664.472 92.865 663.4 89.3708C663.218 88.792 663.068 88.1489 662.918 87.4844C652.842 89.1564 627.761 93.3259 593.934 99.0495C579.743 101.45 561.125 104.119 541.661 106.692C541.35 109.125 540.439 116.274 540.15 118.053C539.785 120.197 536.205 123.616 535.669 124.152C535.133 124.688 532.615 123.08 532.079 124.152C531.543 125.224 528.134 127.56 526.527 127.807C524.919 128.053 522.936 126.478 521.5 127.807C520.064 129.136 518.992 133.83 517.545 135.085C516.098 136.339 514.511 136.339 513.611 136.703C512.711 137.067 510.031 141.183 508.059 142.437C506.087 143.691 500.706 143.874 498.734 145.128C496.762 146.382 496.944 151.762 496.044 151.762C495.143 151.762 492.464 151.226 492.282 151.762C492.099 152.298 491.21 155.353 490.695 157.229C495.947 156.757 501.21 156.307 506.441 155.878C510.35 155.607 514.238 155.084 518.081 154.313V154.313L518.166 154.227L518.241 154.152L518.166 154.227L518.081 154.313C532.615 151.205 527.877 146.007 545.016 145.91C565.659 145.792 568.296 153.552 568.296 153.552L592.134 151.044L619.519 171.27C622.842 169.383 632.049 167.24 634.353 163.327C637.043 158.751 637.311 154.453 642.692 150.465C648.073 146.478 652.907 146.435 656.947 142.673C659.323 140.492 660.843 137.535 661.235 134.334L655.876 132.716C655.876 132.716 658.566 128.686 658.298 126.531C658.03 124.377 652.381 123.573 652.381 123.573L656.958 120.358C656.958 120.358 661.524 124.398 664.75 123.048C667.977 121.697 671.181 116.059 671.481 112.565C671.782 109.071 668.77 106.584 668.77 106.584Z"
          onMouseEnter={() => this.props.onMouseEnter("nc")}
        />
        <text className="us-sub-region-map__label" x="586" y="130">
          NC
        </text>
        <path
          className={this.getStateClassName("ar")}
          d="M360.306 142.883C361.604 140.266 363.229 137.824 365.14 135.616C367.562 133.204 363.789 129.699 363.789 129.699L270.926 131.843L272.63 207.279V207.697C272.63 207.697 283.198 209.583 282.662 218.318C282.577 219.819 282.512 221.77 282.48 223.967H346.201C345.843 218.31 345.818 212.638 346.126 206.978C346.126 206.978 347.197 198.747 348.998 195.521C350.799 192.294 355.429 185.874 355.429 185.874C356.148 183.132 357.109 180.46 358.302 177.889C359.234 176.185 362.01 171.533 363.822 168.521L365.472 165.788C365.472 165.788 369.052 156.141 370.124 152.165C371.078 148.692 373.136 145.734 373.607 142.926L360.306 142.883Z"
          onMouseEnter={() => this.props.onMouseEnter("ar")}
        />
        <text
          className="us-sub-region-map__label us-sub-region-map__label--ar"
          x="305"
          y="180"
        >
          AR
        </text>
        <path
          className={this.getStateClassName("al")}
          d="M485.454 263.982C483.482 261.12 485.636 251.119 485.454 248.74C485.272 246.361 483.482 242.309 482.764 239.962C482.046 237.614 485.454 232.973 485.454 232.973L462.528 159.992C448.497 161.471 434.939 163.068 422.538 164.665C418.486 165.191 414.092 165.641 409.59 166.037C410.479 167.291 411.573 169.767 411.241 174.162C410.737 180.872 411.24 277.122 411.294 289.534C412.705 289.594 414.113 289.379 415.442 288.902C417.318 287.562 418.4 277.605 418.4 277.605C418.4 277.605 422.43 289.17 421.616 290.52C420.801 291.871 429.955 288.634 431.562 287.83L433.46 286.758L433.588 286.683L433.449 280.606C433.449 280.606 431.305 280.241 429.687 276.661C428.068 273.081 432.549 271.634 432.549 271.634L486.226 266.447L485.883 265.589L486.226 266.447H486.333C486.333 266.447 487.426 266.854 485.454 263.982Z"
          onMouseEnter={() => this.props.onMouseEnter("al")}
        />
        <text className="us-sub-region-map__label" x="435" y="225">
          AL
        </text>
        <path
          className={this.getStateClassName("tn")}
          d="M509.055 110.849C478.593 114.6 450.929 117.687 440.104 118.77C418.592 120.914 407.649 121.985 407.649 121.985V126.466L377.691 129.317L376.276 130.957C376.276 130.957 373.768 138.459 373.768 141.675C373.768 142.061 373.661 142.833 373.661 142.833C373.189 145.684 371.131 148.599 370.177 152.072C369.106 156.016 365.526 165.695 365.526 165.695L363.875 168.428C372.45 168.192 391.946 167.538 409.589 165.984C409.298 165.566 408.935 165.203 408.517 164.912C408.935 165.203 409.298 165.566 409.589 165.984C414.09 165.588 418.485 165.137 422.536 164.612C434.938 163.015 448.496 161.397 462.527 159.939C471.766 158.953 481.209 158.02 490.684 157.174C491.22 155.298 492.141 152.082 492.27 151.707C492.399 151.332 495.132 151.707 496.032 151.707C496.932 151.707 496.75 146.348 498.722 145.073C500.695 143.797 506.075 143.636 508.047 142.382C510.02 141.128 512.71 137.023 513.599 136.648C514.489 136.273 516.086 136.284 517.533 135.03C518.98 133.776 520.052 129.07 521.488 127.752C522.924 126.433 524.897 127.998 526.515 127.752C528.134 127.505 531.531 125.169 532.067 124.097C532.603 123.025 535.111 124.633 535.658 124.097C536.204 123.561 539.774 120.153 540.138 117.998C540.427 116.219 541.338 109.07 541.649 106.637C530.845 108.094 519.773 109.531 509.055 110.849Z"
          onMouseEnter={() => this.props.onMouseEnter("tn")}
        />
        <text
          className="us-sub-region-map__label us-sub-region-map__label--tn"
          x="440"
          y="145"
        >
          TN
        </text>
        <path
          className={this.getStateClassName("ok")}
          d="M153.613 180.088L160.044 185.104C160.044 185.104 167.547 184.386 168.619 185.104C169.691 185.823 170.42 190.121 170.42 190.121L177.59 193.336H185.479C185.479 193.336 191.567 191.911 194.053 193.336C196.54 194.762 196.561 199.435 197.633 199.767C199.891 200.137 202.193 200.137 204.45 199.767C205.768 199.56 207.116 199.652 208.395 200.035H213.754L215.554 204.794C215.554 204.794 219.842 197.624 221.985 198.695C224.129 199.767 228.416 203.712 232.018 204.794C235.619 205.877 241.664 200.85 241.664 200.85C243.54 200.321 245.459 199.963 247.399 199.778C249.189 199.778 251.343 201.579 252.415 201.579C253.487 201.579 255.287 199.06 257.442 200.142C259.596 201.225 266.016 206.241 268.16 206.948C269.556 207.324 271.012 207.426 272.447 207.249L270.743 131.813L270.432 117.954L114.341 112.423V112.659L111.061 112.316L93.8584 110.516L92.5508 124.642L155.049 129.53L153.613 180.088Z"
          onMouseEnter={() => this.props.onMouseEnter("ok")}
        />
        <text
          className="us-sub-region-map__label us-sub-region-map__label--ok"
          x="200"
          y="160"
        >
          OK
        </text>
        <path
          className={this.getStateClassName("ms")}
          d="M411.241 174.164C411.573 169.769 410.48 167.293 409.59 166.039C391.948 167.593 372.44 168.247 363.876 168.483C362.065 171.495 359.289 176.146 358.356 177.851C357.164 180.422 356.202 183.094 355.484 185.836C355.484 185.836 350.821 192.267 349.053 195.482C347.284 198.698 346.18 206.94 346.18 206.94C345.873 212.6 345.898 218.272 346.255 223.929C346.33 224.679 346.427 225.376 346.545 225.955C347.616 231.314 351.561 240.66 351.561 240.66L347.97 247.831C347.97 247.831 339.728 261.089 339.728 263.962C339.728 266.834 337.584 272.922 337.938 274.68C338.292 276.438 379.171 274.68 379.171 274.68C379.171 274.68 378.807 283.255 379.525 284.327C380.039 285.098 383.03 289.686 384.67 292.29H384.82C387.503 292.483 390.197 292.483 392.88 292.29L396.846 289.075C396.846 289.075 405.763 289.654 411.316 289.439C411.23 277.124 410.737 180.873 411.241 174.164Z"
          onMouseEnter={() => this.props.onMouseEnter("ms")}
        />
        <text
          className="us-sub-region-map__label us-sub-region-map__label--ms"
          x="370"
          y="231"
        >
          MS
        </text>
        <path
          className={this.getStateClassName("ga")}
          d="M491.199 274.022C493.343 274.022 550.718 270.26 550.718 270.26C550.718 270.26 553.226 276.176 555.552 275.276C557.878 274.376 553.408 263.486 555.552 263.261C557.363 263.111 564.716 263.164 566.999 263.175C566.945 262.789 566.892 262.392 566.849 262.007C566.045 254.214 570.343 243.989 571.962 237.537C572.889 234.165 574.072 230.869 575.499 227.676C574.154 227.414 572.823 227.085 571.511 226.69C569.893 226.154 569.175 219.701 568.296 217.911C567.417 216.121 563.098 214.696 563.098 214.696C562.133 211.422 560.996 208.202 559.689 205.049C558.617 203.077 553.59 200.933 552.519 200.215C551.447 199.497 550.01 196.807 548.231 193.581C546.452 190.354 536.044 184.074 533.89 182.862C531.736 181.651 524.897 170.258 524.897 170.258C524.897 170.258 514.318 165.424 513.429 164.17C512.732 163.194 516.376 157.085 518.07 154.352C514.227 155.122 510.339 155.645 506.43 155.916C501.199 156.345 495.936 156.795 490.684 157.267C481.209 158.114 471.767 159.046 462.527 160.032L485.454 233.013C485.454 233.013 482.045 237.676 482.764 240.002C483.482 242.328 485.282 246.433 485.454 248.78C485.625 251.127 483.482 261.16 485.454 264.022C487.426 266.883 486.354 266.53 486.354 266.53H486.247C487.115 268.631 489.473 274.022 491.199 274.022Z"
          onMouseEnter={() => this.props.onMouseEnter("ga")}
        />
        <text className="us-sub-region-map__label" x="508" y="221">
          GA
        </text>
      </svg>
    );
  }
}
