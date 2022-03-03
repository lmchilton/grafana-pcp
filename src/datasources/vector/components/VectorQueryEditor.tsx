import { css, cx } from 'emotion';
import { defaultsDeep } from 'lodash';
import React, { PureComponent } from 'react';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { InlineFormLabel, Select } from '@grafana/ui';
import { isBlank } from '../../../common/utils';
import { MonacoEditorLazy } from '../../../components/monaco/MonacoEditorLazy';
import { TargetFormat } from '../../../datasources/lib/types';
import { PmapiQueryOptions } from '../../lib/pmapi/types';
import { PCPVectorDataSource } from '../datasource';
import { defaultVectorQuery, VectorOptions, VectorQuery } from '../types';
import { PmapiLanguageDefinition } from './PmapiLanguageDefiniton';

type Props = QueryEditorProps<PCPVectorDataSource, VectorQuery, VectorOptions>;

const FORMAT_OPTIONS: Array<SelectableValue<string>> = [
    { label: 'Time series', value: TargetFormat.TimeSeries },
    { label: 'Heatmap', value: TargetFormat.Heatmap },
    { label: 'Table', value: TargetFormat.MetricsTable },
];

interface State {
    expr: string;
    format: SelectableValue<string>;
    legendFormat?: string;
    options: PmapiQueryOptions;
    url?: string;
    hostspec?: string;
}

export class VectorQueryEditor extends PureComponent<Props, State> {
    languageDefinition: PmapiLanguageDefinition;

    constructor(props: Props) {
        super(props);
        const query = defaultsDeep({}, this.props.query, defaultVectorQuery);
        this.state = {
            expr: query.expr,
            format: FORMAT_OPTIONS.find(option => option.value === query.format) ?? FORMAT_OPTIONS[0],
            legendFormat: query.legendFormat,
            options: {
                rateConversion: query.options.rateConversion,
                timeUtilizationConversion: query.options.rateConversion,
            },
            url: query.url,
            hostspec: query.hostspec,
        };
        this.languageDefinition = new PmapiLanguageDefinition(this.props.datasource, this.getQuery);
    }

    onExprChange = (expr: string) => {
        this.setState({ expr }, this.runQuery);
    };

    onLegendFormatChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
        const legendFormat = isBlank(event.currentTarget.value) ? undefined : event.currentTarget.value;
        this.setState({ legendFormat }, this.runQuery);
    };

    onFormatChange = (format: SelectableValue<string>) => {
        this.setState({ format }, this.runQuery);
    };

    onURLChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
        const url = isBlank(event.currentTarget.value) ? undefined : event.currentTarget.value;
        this.setState({ url }, this.runQuery);
    };

    onHostspecChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
        const hostspec = isBlank(event.currentTarget.value) ? undefined : event.currentTarget.value;
        this.setState({ hostspec }, this.runQuery);
    };

    getQuery = (): VectorQuery => {
        return {
            refId: this.props.query.refId,
            expr: this.state.expr,
            format: this.state.format.value as TargetFormat,
            legendFormat: this.state.legendFormat,
            options: {
                rateConversion: this.state.options.rateConversion,
                timeUtilizationConversion: this.state.options.rateConversion,
            },
            url: this.state.url,
            hostspec: this.state.hostspec,
        };
    };

    runQuery = () => {
        this.props.onChange(this.getQuery());
        this.props.onRunQuery();
    };

    render() {
        return (
            <div>
                <MonacoEditorLazy
                    languageDefinition={this.languageDefinition}
                    alwaysShowHelpText={true}
                    height="60px"
                    value={this.state.expr}
                    onBlur={this.onExprChange}
                    onSave={this.onExprChange}
                />

                <div
                    className={cx(
                        'gf-form-inline',
                        css`
                            margin-top: 6px;
                        `
                    )}
                >
                    <div className="gf-form">
                        <InlineFormLabel
                            width={7}
                            tooltip="Controls the name of the time series, using name or pattern. For example
                            $instance will be replaced with the instance name.
                            Available variables: $metric, $metric0, $instance and $labelName."
                        >
                            Legend
                        </InlineFormLabel>
                        <input
                            type="text"
                            className="gf-form-input"
                            placeholder="legend format"
                            value={this.state.legendFormat}
                            onChange={this.onLegendFormatChange}
                            onBlur={this.runQuery}
                        />
                    </div>

                    <div className="gf-form">
                        <div className="gf-form-label">Format</div>
                        <Select
                            className="width-9"
                            isSearchable={false}
                            options={FORMAT_OPTIONS}
                            value={this.state.format}
                            onChange={this.onFormatChange}
                        />
                    </div>

                    <div className="gf-form">
                        <InlineFormLabel
                            width={5}
                            tooltip="Override the URL to pmproxy for this panel. Useful in combination with templating."
                        >
                            URL
                        </InlineFormLabel>
                        <input
                            type="text"
                            className="gf-form-input"
                            placeholder="override URL"
                            value={this.state.url}
                            onChange={this.onURLChange}
                            onBlur={this.runQuery}
                        />
                    </div>

                    <div className="gf-form">
                        <InlineFormLabel
                            width={9}
                            tooltip="Override the host specification for this panel. Useful for monitoring remote hosts through a central pmproxy."
                        >
                            Host specification
                        </InlineFormLabel>
                        <input
                            type="text"
                            className="gf-form-input"
                            placeholder="override host specification"
                            value={this.state.hostspec}
                            onChange={this.onHostspecChange}
                            onBlur={this.runQuery}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
