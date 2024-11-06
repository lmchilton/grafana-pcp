package pmseries

type GenericSuccessResponse struct {
	Success bool `json:"success"`
}

type GenericErrorResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

type QueryResponse []string

type MetricsResponseItem struct {
	Series string `json:"series"`
	Name   string `json:"name"`
}

type MetricNamesResponse []string

type DescsResponseItem struct {
	Series    string `json:"series"`
	Source    string `json:"source"`
	PMID      string `json:"pmid"`
	Indom     string `json:"indom"`
	Semantics string `json:"semantics"`
	Type      string `json:"type"`
	Units     string `json:"units"`
}

type InstancesResponseItem struct {
	Series   string `json:"series"`
	Source   string `json:"source"`
	Instance string `json:"instance"`
	ID       int    `json:"id"`
	Name     string `json:"name"`
}

type LabelsResponseItem struct {
	Series string                 `json:"series"`
	Labels map[string]interface{} `json:"labels"`
}

type LabelNamesResponse []string

type LabelValuesResponse map[string][]interface{}

type ValuesResponseItem struct {
	Series    string  `json:"series"`
	Timestamp float64 `json:"timestamp"` // milliseconds
	Instance  string  `json:"instance"`  // can be empty
	Value     string  `json:"value"`
}
