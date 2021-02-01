/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS'" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 *
 */

import {
  Context,
  TextMapPropagator,
  SpanContext,
  TraceFlags,
  TextMapSetter,
  TextMapGetter,
  isSpanContextValid,
  isValidSpanId,
  isValidTraceId,
  INVALID_TRACEID,
  INVALID_SPANID,
  getSpanContext,
  setSpanContext,
  INVALID_SPAN_CONTEXT,
} from '@opentelemetry/api';

export const AWSXRAY_TRACE_ID_HEADER = 'X-Amzn-Trace-Id';

const TRACE_HEADER_DELIMITER = ';';
const KV_DELIMITER = '=';

const TRACE_ID_KEY = 'Root';
const TRACE_ID_LENGTH = 35;
const TRACE_ID_VERSION = '1';
const TRACE_ID_DELIMITER = '-';
const TRACE_ID_DELIMITER_INDEX_1 = 1;
const TRACE_ID_DELIMITER_INDEX_2 = 10;
const TRACE_ID_FIRST_PART_LENGTH = 8;

const PARENT_ID_KEY = 'Parent';

const SAMPLED_FLAG_KEY = 'Sampled';
const IS_SAMPLED = '1';
const NOT_SAMPLED = '0';

/**
 * Implementation of the AWS X-Ray Trace Header propagation protocol. See <a href=
 * https://https://docs.aws.amazon.com/xray/latest/devguide/xray-concepts.html#xray-concepts-tracingheader>AWS
 * Tracing header spec</a>
 *
 * An example AWS Xray Tracing Header is shown below:
 * X-Amzn-Trace-Id: Root=1-5759e988-bd862e3fe1be46a994272793;Parent=53995c3f42cd8ad8;Sampled=1
 */
export class AWSXRayPropagator implements TextMapPropagator {
  inject(context: Context, carrier: unknown, setter: TextMapSetter) {
    const spanContext = getSpanContext(context);
    if (!spanContext || !isSpanContextValid(spanContext)) return;

    const otTraceId = spanContext.traceId;
    const timestamp = otTraceId.substring(0, TRACE_ID_FIRST_PART_LENGTH);
    const randomNumber = otTraceId.substring(TRACE_ID_FIRST_PART_LENGTH);

    const xrayTraceId = `1-${timestamp}-${randomNumber}`;
    const parentId = spanContext.spanId;
    const samplingFlag = spanContext.traceFlags ? IS_SAMPLED : NOT_SAMPLED;
    // TODO: Add OT trace state to the X-Ray trace header

    const traceHeader = `Root=${xrayTraceId};Parent=${parentId};Sampled=${samplingFlag}`;
    setter.set(carrier, AWSXRAY_TRACE_ID_HEADER, traceHeader);
  }

  extract(context: Context, carrier: unknown, getter: TextMapGetter): Context {
    const spanContext = this.getSpanContextFromHeader(carrier, getter);
    if (!isSpanContextValid(spanContext)) return context;

    return setSpanContext(context, spanContext);
  }

  fields(): string[] {
    return [AWSXRAY_TRACE_ID_HEADER];
  }

  private getSpanContextFromHeader(
    carrier: unknown,
    getter: TextMapGetter
  ): SpanContext {
    const traceHeader = getter.get(carrier, AWSXRAY_TRACE_ID_HEADER)
      ? getter.get(carrier, AWSXRAY_TRACE_ID_HEADER)
      : getter.get(carrier, AWSXRAY_TRACE_ID_HEADER.toLowerCase());
    // Only if the returned traceHeader is no empty string can be extracted
    if (!traceHeader || typeof traceHeader !== 'string')
      return INVALID_SPAN_CONTEXT;

    let pos = 0;
    let trimmedPart: string;
    let parsedTraceId = INVALID_TRACEID;
    let parsedSpanId = INVALID_SPANID;
    let parsedTraceFlags = null;
    while (pos < traceHeader.length) {
      const delimiterIndex = traceHeader.indexOf(TRACE_HEADER_DELIMITER, pos);
      if (delimiterIndex >= 0) {
        trimmedPart = traceHeader.substring(pos, delimiterIndex).trim();
        pos = delimiterIndex + 1;
      } else {
        //last part
        trimmedPart = traceHeader.substring(pos).trim();
        pos = traceHeader.length;
      }
      const equalsIndex = trimmedPart.indexOf(KV_DELIMITER);

      const value = trimmedPart.substring(equalsIndex + 1);

      if (trimmedPart.startsWith(TRACE_ID_KEY)) {
        parsedTraceId = this._parseTraceId(value);
      }
      if (trimmedPart.startsWith(PARENT_ID_KEY)) {
        parsedSpanId = this._parseSpanId(value);
      }
      if (trimmedPart.startsWith(SAMPLED_FLAG_KEY)) {
        parsedTraceFlags = this._parseTraceFlag(value);
      }
    }
    if (parsedTraceFlags === null) {
      return INVALID_SPAN_CONTEXT;
    }
    const resultSpanContext: SpanContext = {
      traceId: parsedTraceId,
      spanId: parsedSpanId,
      traceFlags: parsedTraceFlags,
      isRemote: true,
    };
    if (!isSpanContextValid(resultSpanContext)) {
      return INVALID_SPAN_CONTEXT;
    }
    return resultSpanContext;
  }

  private _parseTraceId(xrayTraceId: string): string {
    // Check length of trace id
    if (xrayTraceId.length !== TRACE_ID_LENGTH) {
      return INVALID_TRACEID;
    }

    // Check version trace id version
    if (!xrayTraceId.startsWith(TRACE_ID_VERSION)) {
      return INVALID_TRACEID;
    }

    // Check delimiters
    if (
      xrayTraceId.charAt(TRACE_ID_DELIMITER_INDEX_1) !== TRACE_ID_DELIMITER ||
      xrayTraceId.charAt(TRACE_ID_DELIMITER_INDEX_2) !== TRACE_ID_DELIMITER
    ) {
      return INVALID_TRACEID;
    }

    const epochPart = xrayTraceId.substring(
      TRACE_ID_DELIMITER_INDEX_1 + 1,
      TRACE_ID_DELIMITER_INDEX_2
    );
    const uniquePart = xrayTraceId.substring(
      TRACE_ID_DELIMITER_INDEX_2 + 1,
      TRACE_ID_LENGTH
    );
    const resTraceId = epochPart + uniquePart;

    // Check the content of trace id
    if (!isValidTraceId(resTraceId)) {
      return INVALID_TRACEID;
    }

    return resTraceId;
  }

  private _parseSpanId(xrayParentId: string): string {
    return isValidSpanId(xrayParentId) ? xrayParentId : INVALID_SPANID;
  }

  private _parseTraceFlag(xraySampledFlag: string): TraceFlags | null {
    if (xraySampledFlag === NOT_SAMPLED) {
      return TraceFlags.NONE;
    }
    if (xraySampledFlag === IS_SAMPLED) {
      return TraceFlags.SAMPLED;
    }
    return null;
  }
}
